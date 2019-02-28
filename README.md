# node-keep-alive-benchmark

This repository contains benchmarks to compare the performance of outbound HTTP
requests with non-reused connections (Node's default behavior) versus reusing
connections with HTTP Keep-Alive.

## Install Depedencies

```
yarn
```

## Run Benchmarks

First set the `TARGET`, `COUNT`, and `COUNCURRENCY` variables in
`keep-alive-off.js` and `keep-alive-on.js`.

Then, run the benchmarks.

```
node keep-alive-off.js
node keep-alive-on.js
```

## Generating a Flamegraph

To profile CPU utilization and generate a flamegraph ([introduction to
flamegraphs](http://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html)),
first generate a v8.log, then run it through the [flamebearer
tool](https://github.com/mapbox/flamebearer).

### Install flamebearer

```
yarn global add flamebearer
```

### Generate a v8.log

```
node --prof --trace-ic --track_gc_object_stats --trace_gc_verbose --log_timer_events keep-alive-off.js
```

### Generate a flamegraph

```
node --prof-process --preprocess -j isolate*.log | flamebearer
```
