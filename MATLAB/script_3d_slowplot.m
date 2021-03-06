close all;
%solving differential equations

range = linspace(0,100,100001); %time values
ICs=[5, pi/2, 0, 0, 0, 1]; %initial conditions [r, theta, phi, p_r, p_theta, p_phi]

[tsol, varsol]=ode45(@ode_sys_3d,range,ICs);

%plotting solutions
%polar(varsol(:,2) - pi/2, varsol(:,1));
rho = varsol(:,1);
theta = varsol(:,2) - pi/2;
phi = varsol(:,3);

[x,y,z] = sph2cart(phi, theta ,rho);
plot3(x, y, z);