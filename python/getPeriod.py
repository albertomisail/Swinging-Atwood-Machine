import csv
import numpy as np
import cmath

with open('data.csv', 'r') as readFile:
    reader = csv.reader(readFile, delimiter=',')
    lines = [row for row in reader]

lines = lines[::2]
r = [float(x[2]) for x in lines]

fft =  np.fft.fft(r)
fft = [cmath.polar(x)[0] for x in fft]

aux = []

for i in range(0, len(fft)):
    if fft[i] > 10000:
        aux.append((i, fft[i]))

print(aux)
print(len(fft))

# print(fft[:10])

# pos = 0
# max = -1
# for i in range(0, len(fft)):
#     if fft[i] > max:
#         max = fft[i]
#         pos = i
#
# print(pos)
# print(max)
