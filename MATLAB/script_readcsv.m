row_start = 10001; %row number in csv to begin reading from
total_size = 12001; %total number of data rows in csv
col = 2; % use this so select which variable you want to read out

total_rows = total_size - row_start;
t = linspace(500, 600, total_rows); % currently hardcoded needs to be changed
total_data = zeros(total_rows, 202);

total_data(:,1) = t;
no_files = 2; %this should match the no_files used when readin in
mu_s = linspace(1,3,no_files);

for i= 1:no_files
    file_data = read_csv(mu_s(i), row_start, 0);
    total_data(:,i+1) = file_data(:, col);
end

function data = read_csv(u, row, col)
    filename = sprintf('BifurcationData/mass_ratio_%d.csv', u);
    data = csvread(filename, row, col);
end