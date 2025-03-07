# karma

Alert dashboard for
[Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/).

---

Alertmanager `0.16.x` is **NOT** supported by karma due to changes
in the API, see [this issue](https://github.com/prymitive/karma/issues/115)
for details.
A new API endpoint
[was added for 0.17.0](https://github.com/prometheus/alertmanager/pull/1791) and
alertmanager `>=0.17.0` is supported.

---

Alertmanager UI is useful for browsing alerts and managing silences, but it's
lacking as a dashboard tool - karma aims to fill this gap.
Starting with the `0.7.0` release it can aggregate alerts from multiple
Alertmanager instances, running either in HA mode or separate. Unique alerts are
displayed by filtering duplicates. Each alert is tagged with the names of all
Alertmanager instances it was found at and can be filtered based on those tags
(`@alertmanager`). Note that `@alertmanager` tags will be visible only if karma
is configured with multiple Alertmanager instances.

![Screenshot](/docs/img/screenshot.png)

Alerts are displayed grouped preserving
[group_by](https://prometheus.io/docs/alerting/configuration/#route)
configuration option in Alertmanager. If a group contains multiple alerts only
the first few alerts will be presented. Alerts are expanded or hidden
using - / + buttons. The default number of alerts can be configured in the UI
settings module.
Each group can be collapsed to only show the title bar using top right toggle
icon.
Each individual alert will show unique labels and annotations. Labels
and annotations that are shared between all alerts are moved to the footer.

![Example](/docs/img/alertGroup.png)

If all alerts in a group were suppressed by the same silence then, to save
screen space, the silence will also be moved to the footer.

![Deduplicated silence](/docs/img/footerSilence.png)

Silence modal allows to create new silences and manage all silences already
present in Alertmanager.

![Silence browser](/docs/img/silenceBrowser.png)

Clicking on the alert counter in the top left corner will open the overview
modal, which allows to quickly get an overview of the top label values for
all current alerts.

![Overview](/docs/img/overview.png)

Starting with `v0.50` karma can create short lived silences to acknowledge
alerts with a single button click. To create silences that will resolve itself
only after all alerts are resolved you can use
[kthxbye](https://github.com/prymitive/kthxbye).
See [configuration docs](/docs/CONFIGURATION.md#alert-acknowledgement) for
details. Example:

![Acknowledgement demo](/docs/img/ack.gif)

[Online demo](https://karma-demo.herokuapp.com/)

To get notifications about new karma releases go to
[GitHub karma page](https://github.com/prymitive/karma), click `Watch` and
select `Releases only`. This requires GitHub user account.
To subscribe to email notifications without GitHub account you can subscribe to
the RSS feed that
[GitHub provides](https://github.com/prymitive/karma/releases.atom).
To get email notifications from those feeds use one of the free services
providing _RSS to email_ notifications, like
[Blogtrottr](https://blogtrottr.com/).

## History

I created karma while working for [Cloudflare](https://cloudflare.com/),
originally it was called [unsee](https://github.com/cloudflare/unsee).
This project is based on that code but the UI part was rewritten from scratch
using [React](https://reactjs.org/). New UI required changes to the backend so
the API is also incompatible.
Given that the React rewrite resulted in roughly 50% of new code and to avoid
confusion for user I've decided to rename it to karma, especially that the
original project wasn't being maintained anymore.

## Supported Alertmanager versions

Alertmanager's API isn't stable yet and can change between releases, see
`VERSIONS` in [internal/mock/Makefile](/internal/mock/Makefile) for list of all
Alertmanager releases that are tested and supported by karma.
Due to API differences between those releases some features will work
differently or be missing, it's recommended to use the latest supported
Alertmanager version.

## Security

The karma process doesn't send any API request to the Alertmanager that could
modify alerts or silence state, but it does provide a web interface that allows
a user to send such requests directly to the Alertmanager API.
If you wish to deploy karma as a read-only tool please ensure that:

- the karma process is able to connect to the Alertmanager API
- read-only users are able to connect to the karma web interface
- read-only users are NOT able to connect to the Alertmanager API

## Metrics

karma process metrics are accessible under `/metrics` path by default.
If you set the `--listen.prefix` option a path relative to it will be
used.

## Building and running

### Building from source

To clone git repo and build the binary yourself run:

    git clone https://github.com/prymitive/karma $GOPATH/src/github.com/prymitive/karma
    cd $GOPATH/src/github.com/prymitive/karma

To finally compile `karma` the binary run:

    make

Note that building locally from sources requires Go, nodejs and yarn.
See Docker build options below for instructions on building from withing docker
container.

## Running

`karma` can be configured using config file, command line flags or environment
variables. Config file is the recommended method, it's also the only way to
configure karma to use multiple Alertmanager servers for collecting alerts.
To run karma with a single Alertmanager server set `ALERTMANAGER_URI`
environment variable or pass `--alertmanger.uri` flag on the command line, with
Alertmanager URI as argument, example:

    ALERTMANAGER_URI=https://alertmanager.example.com karma
    karma --alertmanager.uri https://alertmanager.example.com

There is a make target which will compile and run karma:

    make run

By default it will listen on port `8080` and Alertmanager mock data will be
used, to override Alertmanager URI set `ALERTMANAGER_URI` and/or `PORT` make
variables. Example:

    make PORT=5000 ALERTMANAGER_URI=https://alertmanager.example.com run

## Docker

### Running pre-build docker image

Official docker images are built and hosted on
[hub.docker.com](https://hub.docker.com/r/lmierzwa/karma/).

Images are built automatically for:

- release tags in git - `lmierzwa/karma:vX.Y.Z`
- master branch commits - `lmierzwa/karma:latest`

#### Examples

To start a release image run:

    docker run -e ALERTMANAGER_URI=https://alertmanager.example.com lmierzwa/karma:vX.Y.Z

Latest release details can be found on
[GitHub](https://github.com/prymitive/karma/releases).

To start docker image build from lastet master branch run:

    docker run -e ALERTMANAGER_URI=https://alertmanager.example.com lmierzwa/karma:latest

Note that latest master branch might have bugs or breaking changes. Using
release images is strongly recommended for any production use.

### Building a Docker image

    make docker-image

This will build a Docker image from sources.

### Running the Docker image

    make run-docker

Will run locally built Docker image. Same defaults and override variables
apply as with `make run`. Example:

    make PORT=5000 ALERTMANAGER_URI=https://alertmanager.example.com run-docker

### Health checks

`/health` endpoint can be used for health check probes, it always responds with
`200 OK` code and `Pong` response body.

## Configuration

Please see [CONFIGURATION](/docs/CONFIGURATION.md) for full list of available
configuration options and [example.yaml](/docs/example.yaml) for a config file
example.

## Contributing

Please see [CONTRIBUTING](/CONTRIBUTING.md) for details.

## License

Apache License 2.0, please see [LICENSE](/LICENSE).
