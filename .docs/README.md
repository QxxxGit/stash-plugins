# Documentation

## Stash Plugin Repository Setup

### Visit your existing GitHub repository

With an existing GitHub repository, you'll need to use GitHub's web interface to setup GitHub Pages.

First, go to your repository page. Click on the **Settings** tab. On the left, you should see **Pages**. Click that and under the **Build and deployment** section, change the dropdown that says `Deploy from a branch` to `GitHub Actions`.

### Adding workflow to deploy the page

Now we need to begin adding the necessary files for GitHub to run a workflow to deploy your page. First, add `build_site.sh` to the root directory. This script will be ran by GitHub Actions to create an index for your plugins, which will later be used by GitHub Pages. You can find a copy of the script [here](scripts/build_site.sh).

> NOTE: Based on your repository, the source URL will eventually look like `https://yourusername.github.io/repo-name/index.yml`

Next, in the root directory of your repository, create a `plugins` directory. This will house all of your plugins, with each plugin being stored in a directory of its own.

Now, let's create a workflow for GitHub to process. Go back to your root directory, create a yml file in the following path: `.github/workflows/deploy.yml`. Copy the contents of the `deploy.yml` script found [here](scripts/deploy.yml) into this new file.

Finally, create or tweak `.gitignore` in your repository to ignore `/_site`. This covers all the necessary files for your repository. Your repo's file structure should look something like the following:

```
.github/
    workflows/
        deploy.yml
plugins/
    examplePlugin/
        examplePlugin.js
        examplePlugin.yml
    testPlugin/
        testPlugin.js
        testPlugin.yml
.gitignore
build_site.sh
```

Push the changes to GitHub. If you visit your repository on GitHub, you should see the workflow running. Next to your commit message you should either see:

* A yellow dot - this means the workflow is running. Wait until it's finished.
* A red X - an error occurred while running the workflow.
* A green checkmark - the workflow ran successfully.

If you receive a red X, click that then the Details link to investigate the issue. One potential issue may be `./build_site.sh: Permission denied`. Simply go back to your root directory, run `chmod +x ./build_site.sh`, commit and push the changes. The workflow will run again.

If you receive a green checkmark, you should be able to visit `https://yourusername.github.io/repo-name/index.yml` to see your list of plugins. This link is your plugin repository source URL that you can share for others to begin installing your plugins within Stash.