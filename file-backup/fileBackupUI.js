(function() {
    'use strict';

    let scenePaths = [];
    let imagePaths = [];

    if(window['stash'] === undefined) {
        console.error('File Backup relies on the Stash Userscript Library plugin. Please make sure it\'s installed correctly.');
        
        return;
    }

    const getScenePaths = (scenes) => {
        scenePaths = [];

        for(let index in scenes) {
            const scene = scenes[index];
            const filePath = scene.files[0].path;

            scenePaths.push(filePath);
        }
    }

    const getImagePaths = (images) => {
        imagePaths = [];

        for(let index in images) {
            const image = images[index];
            const filePath = image.files[0].path;

            imagePaths.push(filePath);
        }
    }

    const buildArguments = (paths) => {
        const pathsArray = [];

        for(const index in paths) {
            const pathObj = {
                'str': paths[index]
            }

            pathsArray.push(pathObj);
        }

        const args = {
            'key': 'files',
            'value': {
                'a': pathsArray
            }
        }

        return args;
    }

    const processScenes = async () => {
        const args = buildArguments(scenePaths);

        await stash.runPluginTask('fileBackup', 'Backup', args);
    }

    const processImages = async () => {
        const args = buildArguments(imagePaths);

        await stash.runPluginTask('fileBackup', 'Backup', args);
    }

    const confirmation = (page) => {
        if(page === 'scenes') {
            processScenes();
        } else if(page === 'images') {
            processImages();
        }
    }

    const display = (page) => {
        waitForElementClass('paginationIndex', () => {
            const buttonId = 'fileBackupBtn';

            if(!document.querySelector(`#${buttonId}`)) {
                const container = document.querySelector('.paginationIndex');

                const button = document.createElement('button');
                button.classList.add('btn', 'btn-secondary');
                button.style.marginLeft = '1em';
                button.innerText = 'Backup';
                button.onclick = () => confirmation(page);
                button.setAttribute('id', buttonId);

                container.appendChild(button);
            }
        });   
    }

    stash.addEventListener('stash:response', (e) => {
        const scenes = e.detail.data.findScenes?.scenes;
        const images = e.detail.data.findImages?.images;

        if(scenes) {
            getScenePaths(scenes);
        }

        if(images) {
            getImagePaths(images);
        }
    });

    stash.addEventListener('page:scenes', () => display('scenes'));
    stash.addEventListener('page:images', () => display('images'));
})();