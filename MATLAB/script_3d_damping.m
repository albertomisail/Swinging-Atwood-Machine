close all;
%solving differential equations

range = linspace(0,500,10001); %time values
ICs=[200, pi/2, 0, 0, 0, 0]; %initial conditions [r, theta, phi, p_r, p_theta, p_phi]

[tsol, varsol]=ode45(@ode_sys_3d_damping,range,ICs);

%plotting solutions%polar(varsol(:,2) - pi/2, varsol(:,1));
rho = varsol(:,1);
theta = varsol(:,2) - pi/2;
phi = varsol(:,3);

[x,y,z] = sph2cart(phi, theta ,rho);
cart = [x y z];
plot3(x, y, z);
zlim([-400, inf]);