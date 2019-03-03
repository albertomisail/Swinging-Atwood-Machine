%solving differential equations

range = linspace(0,20,10001); %time values
ICs=[2, pi/2, 0, 0]; %initial conditions [r, theta, p_r, p_theta]

[tsol, varsol]=ode45(@ode_sys,range,ICs);

%plotting solutions
polar(varsol(:,2) - pi/2, varsol(:,1));