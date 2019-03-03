function diffeqs=ode_sys(t, var)
    r=var(1);
    theta=var(2);
    p_r=var(3);
    p_theta=var(4);
    
    g=9.81;
    m=1;
    u=2.394;
    M=u*m;
    
    diffeqs(1,1)= p_r/(M+m);
    diffeqs(2,1)= p_theta/(m*r^2);
    diffeqs(3,1)= (p_theta^2/(m*r^3)) - M*g + m*cos(theta);
    diffeqs(4,1)= -m*g*r*sin(theta);
end
