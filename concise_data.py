#Script for extracting relevant data from our really large CSV files to condense the total file size
#Aim to only get country data (because the current dataset contains information on regions/groups of countries)

#Countries: All the countries for now

#Metrics: Urban population %, literacy rate %, CO2 emissions per capita, fertility rate, 
#internet access %, gov't expenditure %, educational attainment (bachelors or primary), gross enrollment ratio %

import csv
import sys
import os

#--------------Setting up parameters-----------------------------

#Specify the file (change this to fix your system depending on where/how it's saved)
filenameWDI = r'C:\Users\heheh\Desktop\School\CS3300\P2\WDIData.csv'
filenameED = r'C:\Users\heheh\Desktop\School\CS3300\P2\EdStatsData.csv'

#Specify data indicators to look for and include in data set
indicators = ['Urban population (% of total)', 
            'CO2 emissions (metric tons per capita)',
            'Fertility rate, total (births per woman)',
            'Individuals using the Internet (% of population)', 
            'Government expenditure on education, total (% of GDP)',
            'Government expenditure on education, total (% of government expenditure)',
            'Educational attainment, at least Bachelor or equivalent, population 25+, total (%) (cumulative)',
            'Educational attainment, at least completed primary, population 25+ years, total (%) (cumulative)',
            'Adult literacy rate, population 15+ years, both sexes (%)',
            'Adjusted net enrolment rate, primary, both sexes (%)',
            'Adjusted net enrolment rate, upper secondary, both sexes (%)',
            'Gross enrolment ratio, primary, both sexes (%)',
            'Gross enrolment ratio, tertiary, both sexes (%)']

#Create the target array, first row is the name of fields (country, indicator, years 1980 to 2012)
finalData = []        #Array to become the converted CSV; stores the data grabbed from the CSVs
parameters = ['Country name', 'Country Code', 'Indicator name']
for x in range(1970, 2014):
    parameters.append(str(x))
finalData.append(parameters)
print(finalData)

#-------------------------Read thru the CSV files---------------------------------------

#Read the CSV file for WDI
f = open(filenameWDI, 'r')
dataReaderWDI = csv.reader(f)

rowIdx = 1      #Track the row index
for row in dataReaderWDI:
    if rowIdx < 73980:      #Ignore the rows that aren't countries, which start at row 73980
        rowIdx = rowIdx + 1
        continue
    
    if row[2] in indicators:    #Check if the row corresponds to an indicator we want
        #Delete the entry for indicator abbreviation (extraneous) and pre-1970 data, post-2014 data (so data is consistent)
        newDataRow = row
        del newDataRow[3:14]
        del newDataRow[59:]

        finalData.append(row)
        rowIdx = rowIdx + 1
    else:
        rowIdx = rowIdx + 1
    
    print("WDI Data row: " + str(rowIdx))

#Same thing for ED file
EDfile = open(filenameED, 'r')
dataReaderED = csv.reader(EDfile)

rowIndex = 1
for r in dataReaderED:
    if rowIndex < 91627:
        rowIndex = rowIndex + 1
        continue

    if r[2] in indicators:
        newData = r
        del newData[3]
        del newData[49:]

        finalData.append(r)
        rowIndex = rowIndex + 1
    else:
        rowIndex = rowIndex + 1

    print("ED Data row: " + str(rowIndex))

#------------------------Write to file---------------------------------------------

targetFile = r'C:\Users\heheh\Desktop\School\CS3300\P2\condensed_data.csv'

target = open(targetFile, 'w', newline='')
with target:
    writer = csv.writer(target)
    writer.writerows(finalData)

print("Writing finished")