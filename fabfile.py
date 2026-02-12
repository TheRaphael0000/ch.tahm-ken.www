#!/usr/bin/env python

import click
import fabric


def deploy(c):
    with c.cd("/opt/ch.tahm-ken.www"):
        c.run("git fetch")
        c.run("git status")
        if not click.confirm("Stash and deploy to main ?", default=True):
            exit()
        c.run("git stash")
        c.run("git checkout main")
        c.run("git pull")
        c.run("VITE_BUILD_VERSION=$(git describe --tags | tr -d '\n') docker compose up --build")


c = fabric.Connection(host="tahm-ken.ch", user="root", port=22)
deploy(c)