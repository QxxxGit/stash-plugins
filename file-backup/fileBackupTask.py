import stashapi.log as log
from stashapi.stashapp import StashInterface
import sys
import os
import json
import shutil
from pathlib import Path

json_input = json.loads(sys.stdin.read())
SERVER_CONNECTION = json_input['server_connection']
stash = StashInterface(SERVER_CONNECTION)

CONFIG_DATA = ''
SAVE_DIRECTORY = ''

file_paths = []

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json'), 'r') as cfg_file:
    try:
        CONFIG_DATA = json.load(cfg_file)
        SAVE_DIRECTORY = CONFIG_DATA['save_directory']
    except Exception as e:
        log.error('Error loading config: ' + str(e))
        sys.exit(1)

if not SAVE_DIRECTORY:
    log.error('Save directory not specified!')
    sys.exit(1)

if 'files' in json_input['args']:
    file_paths = json_input['args']['files']

for file in file_paths:
    try:
        path = Path(file)
        file_name = path.name

        shutil.copyfile(file, os.path.join(SAVE_DIRECTORY, file_name))
    except Exception as e:
        log.error('Error copying file: ' + file + ' returned ' + str(e))