#!/usr/bin/python

import json, random, sys

def resample(x_dist, n=10):
    data = []
    for i in range(n):
        x = [random.normalvariate(*t) for t in x_dist]
        m = reduce(lambda x0, x1: x0 * x1, x, 1)
        data.append({'id': i, 'x': x, 'm': m})
    
    sys.stdout.write(json.dumps(data))

resample([(0, 1)] * 2, 127)