close all;
%solving differential equations
no_files = 2;
mu_s = linspace(1,3,no_files);
for i= 1:no_files
    generate_csv(mu_s(i));
end

function generate_csv(u)
    range = linspace(0,600,12001); %time values
    r_0 = 5; theta_0 = pi/2; p_r_0 = 0; p_theta_0 = 0;
    %u = 3;

    ICs=[r_0, theta_0, p_r_0, p_theta_0, u];

    [tsol, varsol]=ode45(@ode_sys, range,ICs);
    varsol(:,2) = varsol(:,2) - pi/2;

    filename = sprintf('BifurcationData/mass_ratio_%d.csv', u);
    csvwrite(filename, [tsol, varsol]);
end

