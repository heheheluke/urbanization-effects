#Script for extracting relevant data from our really large CSV files to condense the total file size
#Aim to only get country data (because the current dataset contains information on regions/groups of countries)

#Countries: All the countries for now

#Metrics: Urban population %, literacy rate %, CO2 emissions per capita, fertility rate, 
#internet access %, gov't expenditure %, educational attainment (bachelors or primary), gross enrollment ratio %

import csv
import sys

#--------------Setting up parameters-----------------------------

#Specify the file (change this filepath depending on where/how it's saved)
filenameWDI = r'C:\Users\heheh\Desktop\School\CS3300\P2\WDIData.csv'
filenameED = r'C:\Users\heheh\Desktop\School\CS3300\P2\EdStatsData.csv'

#Specify data indicators to look for and include in data set
indicators = ['Urban population (% of total)', 
'CO2 emissions (metric tons per capita)',
'Fertility rate, total (births per woman)',
'Individuals using the Internet (% of population)', 
'Government expenditure on education, total (% of GDP)',
'Government expenditure on education, total (% of government expenditure)',
"Educational attainment, at least Bachelor's or equivalent, population 25+, total (%) (cumulative)",
'Educational attainment, at least completed primary, population 25+ years, total (%) (cumulative)',
'Adult literacy rate, population 15+ years, both sexes (%)',
'Gross enrolment ratio, primary, both sexes (%)',
'Gross enrolment ratio, tertiary, both sexes (%)']

#Helper function: 
# Convert the corresponding indicator to an index in the array representing a single country's data
def indicToIdx(indic):
    return {
        'Urban population (% of total)': 3,
        'CO2 emissions (metric tons per capita)': 4,
        'Fertility rate, total (births per woman)': 7,
        'Individuals using the Internet (% of population)': 13, 
        'Government expenditure on education, total (% of GDP)': 8,
        'Government expenditure on education, total (% of government expenditure)': 9,
        "Educational attainment, at least Bachelor's or equivalent, population 25+, total (%) (cumulative)": 5,
        'Educational attainment, at least completed primary, population 25+ years, total (%) (cumulative)': 6,
        'Adult literacy rate, population 15+ years, both sexes (%)': 10,
        'Gross enrolment ratio, primary, both sexes (%)': 11,
        'Gross enrolment ratio, tertiary, both sexes (%)': 12
    }[indic]

#Create the target array, first row is the name of fields (country, indicator, years 1980 to 2012)
finalData = []        #Array to become the converted CSV; stores the data grabbed from the CSVs
parameters = ['Country name', 'Country code', 'Year', 'Urbanization', 
'CO2 emissions', 'Edu attainment (Bachelor)', 'Edu attainment (primary)', 'Fertility rate', 
'Govt exp (GDP)', 'Govt exp (Exp)', 'Literacy rate', 'Enrollment ratio (primary)', 
'Enrollment ratio (tertiary)', 'Internet usage']
finalData.append(parameters)

#-------------------------Read thru the CSV files---------------------------------------

#Helper function to create entries in the final data set. Creates an entry for every year from
#1970 to 2014.
def createEntries(country, countryCode):
    for t in range(1970, 2015):
        newEntry = [country, countryCode, t] + [0]*11
        finalData.append(newEntry)
    print("Entries created for: " + country)

#Given a country, return the array and the index representing the entry in the final data set. Will always
#return the entry corresponding to year 1970.
def getEntry(country):
    i = 0
    for entry in finalData:
        if entry[0] == country:
            return [entry, i]
        i = i+1
    print("Entry not found: " + country)
    return None



#Read the CSV file for WDI
f = open(filenameWDI, 'r')
dataReaderWDI = csv.reader(f)

#Same thing for ED file
EDfile = open(filenameED, 'r')
dataReaderED = csv.reader(EDfile)

countriesChecked = []   #Track countries that already appear in our data set
rowIdx = 1      #Track the row index

#Note: row is in format: [Country, Country code, indicator, ..., 1970, ..., 2013...]
for row in dataReaderWDI:
    if rowIdx < 73980:      #Ignore the rows that aren't countries, which start at row 73980
        rowIdx = rowIdx + 1
        continue
    
    if row[2] in indicators:    #Check if the row corresponds to an indicator we want
        if row[0] not in countriesChecked:  #If we haven't grabbed the data for this country yet
            countriesChecked.append(row[0]) #Add to list of countries, create their entries
            createEntries(row[0], row[1])

        currCountry = getEntry(row[0])
        entry = currCountry[0]
        entryIndex = currCountry[1]

        for time in range(14,59):
            entry[indicToIdx(row[2])] = row[time]       #Change the appropriate idx of the entry to the value at the corresponding time
            if entry[2] != 2014:
                entryIndex = entryIndex + 1                 #Increment index
            entry = finalData[entryIndex]           #Set entry to be the next year
        rowIdx = rowIdx + 1
    else:
        rowIdx = rowIdx + 1
    
    #Print every 10k entries processed to keep track of progress
    if (rowIdx%10000 == 0):
        print("WDI Data row: " + str(rowIdx))

#Same thing for the EducStatsData
rowIndex = 1
for r in dataReaderED:
    if rowIndex < 91627:
        rowIndex = rowIndex + 1
        continue

    if r[2] in indicators:
        currCountry = getEntry(r[0])
        entry = currCountry[0]
        entryIndex = currCountry[1]

        for t in range(4, 49):
            entry[indicToIdx(r[2])] = r[t]
            if entry[2] != 2014:
                entryIndex = entryIndex + 1                 #Increment index
            entry = finalData[entryIndex]           #Set entry to be the next year

        rowIndex = rowIndex + 1
    else:
        rowIndex = rowIndex + 1
    
    if (rowIndex%10000 == 0):
        print("ED Data row: " + str(rowIndex))



#------------------------Write to file---------------------------------------------

targetFile = r'C:\Users\heheh\Desktop\School\CS3300\P2\condensed_data.csv'

target = open(targetFile, 'w', newline='')
with target:
    writer = csv.writer(target)
    writer.writerows(finalData)

print("Writing finished")