close all;
%solving differential equations


range = linspace(0,600,120001); %time values
r_0 = 5; theta_0 = pi/2; p_r_0 = 0; p_theta_0 = 0;
u = 3;
%ICs=[5, pi/2, 0, 0]; %initial conditions [r, theta, p_r, p_theta]
ICs=[r_0, theta_0, p_r_0, p_theta_0, u];

[tsol, varsol]=ode45(@ode_sys, range,ICs);
fname = sprintf('mass_ratio_%d.mat', u);
writematrix

%plotting solutions
theta = varsol(:,2) - pi/2;
rho = varsol(:,1);

[x,y] = pol2cart(theta, rho);
%figure(1)
%polar(varsol(:,2) - pi/2, varsol(:,1));
%figure(2)
plot(x,y);