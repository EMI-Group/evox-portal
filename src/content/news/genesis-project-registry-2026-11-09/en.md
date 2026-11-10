---
title: "Genesis Development: Give Projects a Persistent Registry"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "November 9 changes on main connect project navigation to a persistent VCT registry. Stable mount identity, host-specific loading and a guarded migration make the local-to-remote handoff more explicit."
---

A repository path is only meaningful on the machine that owns it. A laptop and a server can both contain a folder called `demo`, yet opening one should never quietly select the other. Changes merged into **Genesis main on November 9, 2026** replace recent-project tracking across the Projects page with a database-backed project registry and route activation through the selected node. [Projects integration][projects]

![Project folders stay in separate host cabinets with matching registry tags](./project-host-registry.webp)

## Give the path an identity that survives reopening

The Virtual Context Tree, or VCT, maps an absolute operating-system path to a canonical point such as `vct:///projects/demo`. A mount is that mapping: it records the point, path, display name and last-opened time. It gives navigation a stable identity without moving the repository or creating a filesystem mount. [Registry implementation][store]

Registering the same normalized path again refreshes its timestamp while keeping its point. Different paths with the same basename receive distinct points, using suffixes when needed. If an old recorded path no longer exists, a new path with the matching display name and point basename can reuse that point. This is a specific relocation rule, rather than a general inference that similarly named folders are the same project. [Identity rules][identity]

Persistence now lives in the task store's SQLite `vct_mounts` table. The running VCT process holds a read cache; a mutation writes the table atomically before changing that cache. If persistence fails, the mutation returns an error and leaves the prior state intact. Successful changes send a node-aware notification, connecting stored project identity to interface refreshes.

The registry is bounded: by default it retains the 100 newest mounts and evicts the oldest when adding beyond that limit. It is a working navigation record, so it should not be treated as an unlimited archive of every repository ever opened. [Storage and capacity][store]

## Make project search use the same record as project opening

The Projects page and project palette now consume registered mounts. Opening or creating a project calls the node-aware `mount_project` interface, then reloads the list. Path suggestions search registered paths first, matching typed text without case sensitivity, and then add filesystem-prefix suggestions with duplicates removed. Typing part of a familiar path can therefore find a registered project without starting again from its parent directory. [Navigation changes][projects]

The active project's VCT point is looked up from the loaded mounts for display. This lookup does not register a new project merely to render a label. Forgetting a project removes its registry entry; it does not delete the repository's files. These distinctions keep navigation actions separate from changes to the work itself.

## Keep the selected host in the loop

Consider a developer with a local `demo` checkout and another on an SSH server. Selecting the remote host loads that host's project list. While the remote connection is pending, the list stays empty instead of displaying local entries as possible remote projects. Activation is also gated until the connection is ready, preventing a request intended for the server from running against the still-local node. [Remote-first loading and activation][projects]

Remote paths are interpreted for the selected host, including supported POSIX and Windows absolute paths. Remote activation runs asynchronously so directory checks and registration do not block the LiveView interface. A follow-up fix unwraps the remote mount result correctly so the project receives its VCT point. [Remote mount fix][remote]

In that scenario, the useful check is specific: reconnect to the server, search for its registered path, open it, and confirm the selected host and displayed project point. Repeat with the local checkout. Similar folder names should not cause the local registry to fill a pending remote view.

## Carry old project records forward deliberately

For development builds containing this work, the database migration derives VCT mounts from usable legacy `projects` rows, preserves nonblank display names and handles colliding basenames. It retains the newest 100 entries. Blank or relative paths are logged and skipped. If the legacy table cannot be read, the migration aborts and rolls back, preserving that table and its rows instead of treating a read failure as an empty project list. [Migration safeguard and upstream test coverage][migration]

Before trying such a build with an existing workspace, back up the application data on each relevant host. After startup, check that known projects appear on the correct host, that reopening keeps the same point, and that the list survives a restart. If boot reports a migration error, keep the database and diagnostic output for investigation rather than deleting the store to obtain an empty list.

This work makes the project boundary visible at the moment a developer chooses where to work. For the related question of keeping code histories separate across repositories, read [Genesis Multi-Repository Work: One Objective, Separate Histories](/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
