close all;
%solving differential equations
t= 100;
n = 10001;
range = linspace(0,t,n); %time values
ICs=[5, pi/2, 0, 0, 0, 1]; %initial conditions [r, theta, phi, p_r, p_theta, p_phi]

[tsol_f, varsol_f]=ode45(@ode_sys_3d_forced,range,ICs);
[tsol, varsol]=ode45(@ode_sys_3d,range,ICs);

%plotting solutions
%polar(varsol(:,2) - pi/2, varsol(:,1));
rho = varsol(:,1);
theta = varsol(:,2) - pi/2;
theta1 = varsol(:,2);
phi = varsol(:,3);

rho_f = varsol_f(:,1);
theta_f = varsol_f(:,2) - pi/2;
theta1_f= varsol_f(:,2);
phi_f = varsol_f(:,3);

[x,y,z] = sph2cart(phi, theta ,rho);
%cart = [x, y, z, rho.*sin(theta + pi/2).*cos(phi),  rho.*sin(phi), -rho.*cos(theta + pi/2).*cos(phi)];
cart = [x, y, z, rho.*sin(theta1).*cos(phi), rho.*sin(theta1).*sin(phi), rho.*cos(theta1)];
plot3(x, y, z);
hold on;

[x_f,y_f,z_f] = sph2cart(phi_f, theta_f ,rho_f);
%cart = [x, y, z, rho.*sin(theta + pi/2).*cos(phi),  rho.*sin(phi), -rho.*cos(theta + pi/2).*cos(phi)];
cart = [x_f, y_f, z_f, rho_f.*sin(theta1_f).*cos(phi_f), rho.*sin(theta1_f).*sin(phi_f), rho_f.*cos(theta1_f)];
plot3(x_f, y_f, z_f);
legend('Free','Forced', 'Location', 'southeast');
hold off;
%{
figure(1)
for i=1:numel(x)-1
    plot3([x(i),x(i+1)], [y(i),y(i+1)], [z(i),z(i+1)], 'k')
    axis([min(x) max(x) min(y) max(y) min(z) max(z)])
    hold on
    pause(t/n)
end
%}
