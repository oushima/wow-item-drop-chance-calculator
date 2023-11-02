"""Configuration settings for WoW API script.

This configuration file contains placeholders for the required settings.
Users should replace the placeholder values
with their actual Blizzard API credentials
and the desired WoW API settings.

After filling in the necessary details, rename this file
from 'example.config.py' to 'config.py',
or create a new 'config.py' file and copy the contents
of this file into it, without the 'example.' prefix.

Realm names with spaces should be written with hyphens as separators.
For example, 'Emerald Dream' should be written as 'emerald-dream'.
"""

# Mapping of realms to a set of example character names.
CHARACTER_REALM_MAPPING = {
    'realm1': {'characterA', 'characterB', 'characterC'},
    'realm2': {'characterD', 'characterE', 'characterF'},
    'realm3': {'characterG', 'characterH', 'characterI'},
}

# Raid details.
RAID_NAME = "Example Raid"
RAID_BOSS = "Example Boss"
