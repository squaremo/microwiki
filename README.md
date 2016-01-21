## Micro-service wiki example application

This is an eventually-over-engineered wiki.

## Build and run

```
docker build microwiki-standalone .
```

That will build an image of the standalone wiki (it's a single file,
and has to dependencies outside NodeJS's standard library).

```
docker run --name wiki -d -p 80 microwiki-standalone
docker port wiki 80
```

That will run the image in a container named `'wiki'`, amd publish its
port 80 to the host. The second command tells you which *host* port
maps to the container port. You can then open a browser or `curl` to
`http://localhost:<that port>`.
