close all;
%solving differential equations

range = linspace(0,500,100001); %time values
ICs=[5, pi/2, 0, 0]; %initial conditions [r, theta, p_r, p_theta]

[tsol, varsol]=ode45(@ode_sys,range,ICs);

%plotting solutions
theta = varsol(:,2) - pi/2;
rho = varsol(:,1);

[x,y] = pol2cart(theta, rho);
figure(1)
polar(varsol(:,2) - pi/2, varsol(:,1));
figure(2)
plot(x,y);