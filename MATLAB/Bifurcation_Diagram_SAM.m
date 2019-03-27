clc;
clear;
close all;

% r_s = linspace(1,10,180); x= r_s;
% theta_s = linspace(0,pi,180); x= theta_s;
% phi_s = linspace(0,2*pi,360); x= phi_s;
% p_r_s = linspace(0,10,100); x= p_r_s;
% p_theta_s = linspace(0,10,100); x= p_theta_s;
% p_phi_s = linspace(0,10,100); x= p_phi_s;
 mu_s = linspace(1,3,200); x= mu_s;

y = zeros(100,numel(x)); 
g=9.81;
m=1;
for i=1:numel(x)
    
    z=[2;pi/2;0;0;mu_s(i)];
    
    %z(1)= r_s(i);
    %z(2)= theta_s(i);
    %z(3)= p_r_s(i);
    %z(4)= p_theta_s(i);
    %mu= mu_s(i); M= mu*m;
    
    range = linspace(0,500,10001); %time values
    [tsol, varsol]=ode45(@ode_sys,range,z);
    y(:,i)= atan(tan(varsol(10001-1999:20:10001,2)));
end
plot(x,y,'.')
title('Bifurcation Diagram for mass ratio with initial conditions r=2,\theta=\pi/2');
ylabel('\theta');
xlabel('mass ratio');

function diffeqs=ode_sys(t, var)
    r=var(1); %length of pendulum
    theta=var(2); %angle of pendulum from vertical
    p_r=var(3); %pendulum momentum in the r direction
    p_theta=var(4); %pendulum momentum in the theta direction
    u=var(5);
    
    g=9.81; %gravitationa1 constant
    m=1; %pendulum mass
    %u=3; %mass ratio
    M=u*m; %larger mass
    
    %differential equations obtained from hamiltonian
    diffeqs(1,1)= p_r/(M+m); %dr/dt = dH/dp_r
    diffeqs(2,1)= p_theta/(m*r^2); %dtheta/dt = dH/dp_theta
    diffeqs(3,1)= (p_theta^2/(m*r^3)) - M*g + m*g*cos(theta); %dp_r/dt = dH/dr
    diffeqs(4,1)= -m*g*r*sin(theta); %dp_theta/dt = dH/dtheta
    diffeqs(5,1)= 0;
end
