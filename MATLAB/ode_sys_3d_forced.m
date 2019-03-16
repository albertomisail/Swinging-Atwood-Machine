function diffeqs=ode_sys_3d_forced(t, var)
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
    F=10;
    
    %differential equations obtained from hamiltonian
    diffeqs(1,1)= p_r/(M+m); %dr/dt = dH/dp_r
    diffeqs(2,1)= p_theta/(m*r^2); %dtheta/dt = dH/dp_theta
    diffeqs(3,1)= p_phi/(m*r^2*(sin(theta))^2);
    diffeqs(4,1)= (p_theta^2/(m*r^3)) + (p_phi^2/(m*r^3*(sin(theta))^2)) - M*g + m*g*cos(theta)+ F*sin(t); %dp_r/dt = dH/dr
    diffeqs(5,1)= (p_phi^2*cos(theta)/(m*r^2*(sin(theta))^3)) - m*g*r*sin(theta); %dp_theta/dt = dH/dtheta
    diffeqs(6,1)= 0;
end
