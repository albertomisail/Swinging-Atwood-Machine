from redditSimulation import simulate
from numpy import *

start = 4500
end = 6500
mus = linspace(start, end, end-start+1)

for mu in mus:
    simulate(mu)
