from numpy import *
import matplotlib.pyplot as plt
import os

seterr(all='raise')       #If we encounter overflows, trigger an error (that'll be resolved by 'try-catch')

def RKalgorithm():
    global flag
    flag         = False
    variables[0] = array([r0, rdot0, -theta0, -thetadot0])  #Thetas are negative to agree with the diagram in the paper that goes along with it

    for i in range(indices - 1):
        try:
            if(((theta0 == 0 and thetadot0 == 0) or theta0 == pi) and i == 0):
                print('Warning: Unstable or stable equilibrium chosen as initial value. Results may be unintended.')
            if(variables[i][0] <= (threshold * r0)):
                print('The trajectory came within the threshold for identifying a singularity (%.4f%% of r0). The program has finished early (%.2f s) to avoid infinities.' % ((threshold * r0 * 100), (i * step)))
                break

            k1 = step * RKaccel(variables[i], times[i])
       	    k2 = step * RKaccel(variables[i] + k1 / 2, times[i] + step/2)
       	    k3 = step * RKaccel(variables[i] + k2 / 2, times[i] + step/2)
       	    k4 = step * RKaccel(variables[i] + k3, times[i] + step)

       	    variables[i + 1] = variables[i] + k1/6 + k2/3 + k3/3 + k4/6

       	except FloatingPointError:    #This isn't actually an error, but we've told the system to associate OVERFLOWS with errors.
       	    flag = True
       	    print('A Runtime Warning was triggered, indicating infinities as r -> 0. Increase the singularity threshold.')
       	    print('As a result, plotting procedures have been abandoned to avoid an erroneous display.')
       	    break

def RKaccel(variables, times):
    radius    = variables[0]
    radiusdot = variables[1]
    theta     = variables[2]
    thetadot  = variables[3]

    radiusdotdot = ((radius / (1 + mu)) * ((thetadot) ** 2)) + (((g * cos(theta)) - (g * mu)) / (1 + mu))
    thetadotdot  = - ((g * sin(theta)) / radius) - (2 * ((radiusdot) * (thetadot)) / radius)

    return array([radiusdot, radiusdotdot, thetadot, thetadotdot])

#Initialize algorithmic variables.
step      = 0.002
maxtime   = 50
threshold = 0.01   #singularity theshold! read the paper.

indices = int(maxtime / step)
times   = linspace(0, (indices - 1) * step, indices)

#Initialize the initial physical variables.
r0         = 1
rdot0      = 0
theta0     = -pi / 2
thetadot0  = 0
g          = 9.8
variables = zeros([indices, 4], dtype=float)

def simulate(ratio):
    global mu
    mu = ratio / 1000

    #Runge-Kutta algorithm variables
    RKalgorithm()


    #Begin plotting
    fig = plt.figure()
    ax = plt.subplot(111, projection='polar')
    ax.set_theta_zero_location("S")
    ax.plot(variables[:,2], variables[:,0], color='b', linewidth=1)
    plt.title('$\mu = %.3f$, $r_0 = %.3f$, $\\theta_0 = %.3f^\degree$' % (mu, r0, -theta0 * 180 / pi), y = 1.06)
    plt.axis('off')
    ax.grid(True)
    if(flag == False):
        print('Calculation was successful for mu = %.3f.' % mu)
        savePath = os.getcwd() + r'\images\mu' + str(int(ratio)) + '.png'
        plt.savefig(savePath)
    plt.close(fig)

# import csv
#
# with open('data.csv', 'w') as writeFile:
#     writer = csv.writer(writeFile)
#     for var in variables:
#         writer.writerow(var)
#
# writeFile.close()
