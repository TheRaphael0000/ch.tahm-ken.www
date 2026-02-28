#!/usr/bin/env python

import click
import fabric
import requests


def deploy(c):
    REPO = "TheRaphael0000/ch.tahm-ken.www"
    releases = requests.get(
        f"https://api.github.com/repos/{REPO}/releases").json()
    versions = [r["tag_name"] for r in releases]
    for v in versions:
        print(f"- {v}")
    version = click.prompt(
        "Version to deploy",
        type=click.Choice(versions),
        show_choices=False,
        default=versions[0]
    )
    release_url = f"https://github.com/{REPO}/releases/download/{version}/tahm-ken.ch-{version}.tar.gz"

    with c.cd("/opt/ch.tahm-ken.www"):
        has_version = c.run(f"test -d {version}", warn=True).ok
        if not has_version:
            c.run(f"mkdir -p {version}")
            c.run(f"curl -L {release_url} | tar -xzf - -C {version}")
        c.run(f"rsync -av --delete --progress --size-only {version}/ live/")


c = fabric.Connection(host="tahm-ken.ch", user="root", port=22)
deploy(c)
