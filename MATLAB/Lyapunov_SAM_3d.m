g=9.81; %gravitationa1 constant
m=1; %pendulum mass
u=10; %mass ratio
M=u*m; %larger mass

Ly=zeros(6,100);

% r_s = linspace(1,10,180); x= r_s;
% theta_s = linspace(0,pi,180); x= theta_s;
% phi_s = linspace(0,2*pi,360); x= phi_s;
 p_r_s = linspace(0,10,100); x= p_r_s;
% p_theta_s = linspace(0,10,100); x= p_theta_s;
% p_phi_s = linspace(0,10,100); x= p_phi_s;
% u_s = linspace(1,20,100); x= u_s;

for i = 1:numel(x)
    z_0= [1;0.5;0.5;0.1;0.1;0.1];
    
    %z_0(1)= r_s(i);
    %z_0(2)= theta_s(i);
    %z_0(3)= phi_s(i);
    z_0(4)= p_r_s(i);
    %z_0(5)= p_theta_s(i);
    %z_0(6)= p_phi_s(i);
    %u= u_s(i); M= u*m;
    L=100;
    
    range = linspace(0,500,10001); %time values
    [tsol, varsol]=ode45(@ode_sys_3d,range,z_0);
    
    Q=eye(6);
    for l=1:L
        z=varsol(10*l,:);
        Jn=get_jacobian(z,m,M);
        Mn=eye(6)+Jn;
        J=Mn*Q;
        [Q,R]=qr(J);
        Ly(:,i)=Ly(:,i)+log(abs(diag(R)))/L;
    end
end

close all;
plot(x,Ly(1,:));
hold on;
plot(x,Ly(2,:));
plot(x,Ly(3,:));
plot(x,Ly(4,:));
plot(x,Ly(5,:));
plot(x,Ly(6,:));
legend('r','\theta','\phi','p_r','p_{\theta}','p_{\phi}');

function J = get_jacobian(var,m,M)
    r=var(1); %length of pendulum
    theta=var(2); %angle of pendulum from vertical
    phi=var(3); %azimuthal angle of pendulum
    p_r=var(4); %pendulum momentum in the r direction
    p_theta=var(5); %pendulum momentum in the theta direction
    p_phi=var(6); %pendulum momentum in the theta direction

    g=9.81; %gravitationa1 constant
    
    J= zeros(6,6);
    J(1,4)= 1/(M+m);
    J(2,1)= -2*p_theta/(m*r^3);
    J(2,5)= 1/(m*r^2);
    J(3,1)= -2*p_phi/(m*r^3*(sin(theta))^2);
    J(3,2)= -2*p_phi*cos(theta)/(m*r^2*(sin(theta))^3);
    J(3,6)= 1/(m*r^2*(sin(theta))^2);
    J(4,1)= (-3*p_theta^2/(m*r^4)) + (-3*p_phi^2/(m*r^4*(sin(theta))^2));
    J(4,2)= (-2*cos(theta)*p_phi^2/(m*r^3*(sin(theta))^3)) - m*g*sin(theta);
    J(4,5)= (2*p_theta/(m*r^3));
    J(4,6)= (2*p_phi/(m*r^3*(sin(theta))^2));
    J(5,1)= (-2*p_phi^2*cos(theta)/(m*r^3*(sin(theta))^3)) - m*g*sin(theta);
    J(5,2)= (-p_phi^2*((sin(theta))^2+3*(cos(theta))^2)/(m*r^2*(sin(theta))^4)) - m*g*r*cos(theta);
    J(5,6)= (2*p_phi*cos(theta)/(m*r^2*(sin(theta))^3));
end

function diffeqs=ode_sys_3d(t, var)
    r=var(1); %length of pendulum
    theta=var(2); %angle of pendulum from vertical
    phi=var(3); %azimuthal angle of pendulum
    p_r=var(4); %pendulum momentum in the r direction
    p_theta=var(5); %pendulum momentum in the theta direction
    p_phi=var(6); %pendulum momentum in the theta direction
    
    g=9.81; %gravitationa1 constant
    m=1; %pendulum mass
    u=3; %mass ratio
    M=u*m; %larger mass
    
    %differential equations obtained from hamiltonian
    diffeqs(1,1)= p_r/(M+m); %dr/dt = dH/dp_r
    diffeqs(2,1)= p_theta/(m*r^2); %dtheta/dt = dH/dp_theta
    diffeqs(3,1)= p_phi/(m*r^2*(sin(theta))^2);
    diffeqs(4,1)= (p_theta^2/(m*r^3)) + (p_phi^2/(m*r^3*(sin(theta))^2)) - M*g + m*g*cos(theta); %+ F*sin(t); %dp_r/dt = dH/dr
    diffeqs(5,1)= (p_phi^2*cos(theta)/(m*r^2*(sin(theta))^3)) - m*g*r*sin(theta); %dp_theta/dt = dH/dtheta
    diffeqs(6,1)= 0;
end