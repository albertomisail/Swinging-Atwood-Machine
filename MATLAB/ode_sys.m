function diffeqs=ode_sys(t, var)
    r=var(1); %length of pendulum
    theta=var(2); %angle of pendulum from vertical
    p_r=var(3); %pendulum momentum in the r direction
    p_theta=var(4); %pendulum momentum in the theta direction
    
    g=9.81; %gravitationa1 constant
    m=1; %pendulum mass
    u=2.394; %mass ratio
    M=u*m; %larger mass
    
    %differential equations obtained from hamiltonian
    diffeqs(1,1)= p_r/(M+m); %dr/dt = dH/dp_r
    diffeqs(2,1)= p_theta/(m*r^2); %dtheta/dt = dH/dp_theta
    diffeqs(3,1)= (p_theta^2/(m*r^3)) - M*g + m*cos(theta); %dp_r/dt = dH/dr
    diffeqs(4,1)= -m*g*r*sin(theta); %dp_theta/dt = dH/dtheta
end
