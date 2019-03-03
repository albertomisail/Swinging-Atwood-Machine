
%range=[1:60:100];
range = linspace(0,20,10001);
ICs=[2, pi/2, 0, 0];

[tsol, varsol]=ode45(@ode_sys,range,ICs);

%theta = 
polar(varsol(:,2) - pi/2, varsol(:,1));