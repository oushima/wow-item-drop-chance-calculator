"""Module for interacting with the World of Warcraft (WoW) API.

This module provides functionality to
fetch character data, check raid boss kills,
and generate reports based on the data obtained from the WoW API. It makes use
of Blizzard's OAuth authentication to securely access API endpoints.

Environment Variables:
    CLIENT_ID: The client ID for Blizzard API.
    CLIENT_SECRET: The client secret for Blizzard API.
    REGION: The region for which the API calls should be made.

The module relies on a configuration file 'config.py' to import constants such
as CHARACTER_REALM_MAPPING, RAID_NAME, and RAID_BOSS.

Attributes:
    CHARACTER_REALM_MAPPING (dict): Mapping of character names
    to their respective realms.
    RAID_NAME (str): Name of the raid to report on.
    RAID_BOSS (str): Name of the boss in the raid.

"""

import os
from datetime import datetime, timedelta
import json
import requests
import pytz

from dotenv import load_dotenv

# pylint: disable=import-error
from config import RAID_BOSS, RAID_NAME, CHARACTER_REALM_MAPPING

# Load environment variables
load_dotenv()

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
region = os.getenv('REGION')


def fetch_blizzard_token(local_client_id, local_client_secret, local_region):
    """Fetch Blizzard API access token.

    Args:
        client_id (str): The client ID for Blizzard API.
        client_secret (str): The client secret for Blizzard API.
        region (str): The region for Blizzard API.

    Returns:
        str: The access token, if successful. None otherwise.
    """
    auth = (local_client_id, local_client_secret)
    data = {'grant_type': 'client_credentials'}
    url = f'https://{local_region}.battle.net/oauth/token'
    response = requests.post(url, data=data, auth=auth, timeout=10)
    return (response.json().get('access_token')
            if response.status_code == 200 else None)


def fetch_character_data(local_access_token, local_region,
                         local_realm_slug, local_character_name):
    """Fetch character data from the WoW API.

    Args:
        access_token (str): The access token for authentication.
        region (str): The region for the API request.
        realm_slug (str): The slug of the realm for the character.
        character_name (str): The name of the character.

    Returns:
        dict: Character data if successful, None otherwise.
    """
    api_url = (
        f"https://{local_region}.api.blizzard.com/profile/wow/character/"
        f"{local_realm_slug}/{local_character_name}/encounters/raids"
        f"?namespace=profile-{region}&locale=en_US"
    )
    headers = {'Authorization': f"Bearer {local_access_token}"}
    response = requests.get(api_url, headers=headers, timeout=30)

    if response.status_code == 200:
        return json.loads(response.text)
    else:
        print(f"Failed to fetch data for {local_character_name}-"
              f"{local_realm_slug} with status code "
              f"{response.status_code}")

        return None


def check_last_kill(data, char_name, local_realm_slug, local_raid_name,
                    local_raid_boss, local_difficulty_dict,
                    is_available_after_wednesday, local_total_kills_dict):
    """Check if specified raid boss was killed within the last week.

    Args:
        data (dict): The character data containing raid info.
        char_name (str): The name of the character.
        local_realm_slug (str): The slug of the character's realm.
        local_raid_name (str): The name of the raid.
        local_raid_boss (str): The name of the raid boss.
        local_difficulty_dict (dict): Dictionary to store difficulties data.
        is_available_after_wednesday (bool): Flag for the weekly reset.
        local_total_kills_dict (dict): Dictionary to store total kills.

    Returns:
        None
    """
    cet_now = datetime.now(pytz.timezone('CET'))
    wednesday_5am = (
        cet_now - timedelta(
            days=cet_now.weekday(),
            weeks=(cet_now.weekday() < 2 or
                   (cet_now.weekday() == 2 and cet_now.hour < 5)),
            hours=cet_now.hour - 5, minutes=cet_now.minute,
            seconds=cet_now.second, microseconds=cet_now.microsecond)
    )

    if data:
        for expansion in data.get('expansions', []):
            for instance in expansion.get('instances', []):
                if instance.get('instance', {}).get('name') == local_raid_name:
                    for mode in instance.get('modes', []):
                        for encounter in mode.get(
                                'progress', {}).get('encounters', []):
                            if (encounter.get('encounter', {}).get('name') ==
                                    local_raid_boss):
                                last_kill_timestamp = encounter.get(
                                    'last_kill_timestamp') / 1000.0
                                last_kill_date = datetime.fromtimestamp(
                                    last_kill_timestamp, pytz.timezone('CET'))
                                last_kill_str = last_kill_date.strftime(
                                    '%d-%B-%Y, %H:%M (CET)')

                                local_difficulty = mode.get(
                                    'difficulty', {}).get('name')
                                character_info_local = (
                                    f"{char_name}-{local_realm_slug}, "
                                    f"{last_kill_str}"
                                )

                                difficulty_key = (
                                    f'{local_difficulty} - '
                                    'Last Kill Timestamp'
                                )

                                if difficulty_key not in local_difficulty_dict:
                                    local_difficulty_dict[difficulty_key] = []

                                local_difficulty_dict[
                                    f'{local_difficulty} - Last Kill Timestamp'
                                ].append(character_info_local)

                                if is_available_after_wednesday and \
                                        last_kill_date < wednesday_5am:
                                    key = f'{local_difficulty} - Raid Reset'
                                    if key not in local_difficulty_dict:
                                        local_difficulty_dict[key] = []
                                    local_difficulty_dict[key].append(
                                        character_info_local)
                                else:
                                    key = f'{local_difficulty} - Raid Lockout'
                                    if key not in local_difficulty_dict:
                                        local_difficulty_dict[key] = []
                                    local_difficulty_dict[key].append(
                                        character_info_local)

                                # Count total kills
                                completed_count = encounter.get(
                                    'completed_count', 0)
                                local_total_kills_dict['total_kills'] += (
                                    completed_count
                                )
                                break


if __name__ == "__main__":
    difficulty_dict = {}
    total_kills_dict = {'total_kills': 0}

    access_token = fetch_blizzard_token(client_id, client_secret, region)
    available_after_wednesday = datetime.now(
        pytz.timezone('CET')).weekday() >= 2

    if access_token:
        # Assume CHARACTER_REALM_MAPPING is a valid dict
        for realm_slug, character_names in CHARACTER_REALM_MAPPING.items():
            for character_name in character_names:
                character_data = fetch_character_data(
                    access_token, region, realm_slug, character_name)
                if character_data:
                    check_last_kill(character_data, character_name,
                                    realm_slug, RAID_NAME, RAID_BOSS,
                                    difficulty_dict,
                                    available_after_wednesday,
                                    total_kills_dict)

    with open('wow_raid_report.txt', 'w', encoding='utf-8') as f:
        for difficulty, characters in sorted(difficulty_dict.items()):
            f.write(f"{difficulty}\n")
            for i, character_info in enumerate(sorted(characters), start=1):
                f.write(f"{i}. {character_info}\n")
            f.write("\n")

        # Write total kills at the end of the report
        f.write(f"Total boss kills across all characters: "
                f"{total_kills_dict['total_kills']}\n")

    # Print to console the report summary
    print("Report has been generated: wow_raid_report.txt")
