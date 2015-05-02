#!/usr/bin/python

import pandas as pd

dpath = './'

crash = pd.read_csv(dpath+"crash_precincts.csv")

pcts = sorted(crash.precinct.unique())

for pct in pcts:
  pct_csv = crash[crash['precinct']==pct]
  pct_csv.to_csv(dpath+"../page/csv/pcts/collisions_%s.csv" % (pct), index = False)
  print '<option value="%s">Precinct %s</option>' % (pct,pct)

