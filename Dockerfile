FROM node:12.13.1-alpine3.9 as nodejs-builder
RUN apk update && apk upgrade && apk add --update make git
COPY Makefile /src/Makefile
COPY ui /src/ui
RUN make -C /src ui

FROM golang:1.13.4-alpine as go-builder
RUN apk update && apk upgrade && apk add --update make git
COPY Makefile /src/Makefile
COPY go.mod /src/go.mod
COPY go.sum /src/go.sum
RUN make -C /src download-deps
COPY --from=nodejs-builder /src/ui /src/ui
COPY --from=nodejs-builder /src/.build /src/.build
COPY cmd /src/cmd
COPY internal /src/internal
ARG VERSION
RUN CGO_ENABLED=0 make -C /src VERSION="${VERSION:-dev}" karma

FROM ubuntu:16.04

COPY ./contrib/ /opt/app-root
COPY ./root/usr/ /usr/bin

## Fix permissions for scripts
RUN chmod uog+x /usr/bin/fix-permissions
RUN chmod uog+x /usr/bin/uid_entrypoint
RUN chmod uog+x /usr/bin/cgroup-limits
RUN chmod uog+w /etc/passwd

RUN addgroup -gid 1000 karma \
 && adduser -gid 1000 -uid 1000 karma \
 && chown -R karma:karma /opt

COPY --from=go-builder /src/karma /opt/karma

RUN chown -R 1000:0 /opt && fix-permissions /opt

EXPOSE 8080

ENTRYPOINT [ "uid_entrypoint" ]

USER karma

CMD ["/opt/karma"]
