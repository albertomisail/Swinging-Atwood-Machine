close all;
%solving differential equations
t= 500;
n = 10001;
range = linspace(0,t,n); %time values
ICs=[5, pi/2, 0, 0, 0, 1]; %initial conditions [r, theta, phi, p_r, p_theta, p_phi]

[tsol, varsol]=ode45(@ode_sys_3d,range,ICs);

%plotting solutions
%polar(varsol(:,2) - pi/2, varsol(:,1));
rho = varsol(:,1);
theta = varsol(:,2) - pi/2;
theta1 = varsol(:,2);
phi = varsol(:,3);

[x,y,z] = sph2cart(phi, theta ,rho);
%cart = [x, y, z, rho.*sin(theta + pi/2).*cos(phi),  rho.*sin(phi), -rho.*cos(theta + pi/2).*cos(phi)];
cart = [x, y, z, rho.*sin(theta).*cos(phi),  rho.*sin(phi), rho.*cos(theta).*cos(phi)];
plot3(x, y, z);
%{
figure(1)
for i=1:numel(x)-1
    plot3([x(i),x(i+1)], [y(i),y(i+1)], [z(i),z(i+1)], 'k')
    axis([min(x) max(x) min(y) max(y) min(z) max(z)])
    hold on
    pause(t/n)
end
%}
