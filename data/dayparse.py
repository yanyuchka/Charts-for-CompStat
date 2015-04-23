import csv
from datetime import datetime

file_in = 'NYPD_Motor_Vehicle_Collisions.csv'
file_out = 'parsed-output.csv'

#-----------------------------#
#           MAIN
#-----------------------------#
def main():

  field = {
    'DATE' : '',
    'BOROUGH' : '',
    'NUMBER_OF_PERSONS_INJURED' : 0,
    'NUMBER_OF_PERSONS_KILLED' : 0,
    'NUMBER_OF_PEDESTRIANS_INJURED' : 0,
    'NUMBER_OF_PEDESTRIANS_KILLED' : 0,
    'NUMBER_OF_CYCLIST_INJURED' : 0,
    'NUMBER_OF_CYCLIST_KILLED' : 0,
    'NUMBER_OF_MOTORIST_INJURED' : 0,
    'NUMBER_OF_MOTORIST_KILLED' : 0,
  }

  
  fieldnames = ['DATE','NUMBER_OF_PERSONS_INJURED','NUMBER_OF_PERSONS_KILLED','NUMBER_OF_PEDESTRIANS_INJURED','NUMBER_OF_PEDESTRIANS_KILLED','NUMBER_OF_CYCLIST_INJURED','NUMBER_OF_CYCLIST_KILLED','NUMBER_OF_MOTORIST_INJURED','NUMBER_OF_MOTORIST_KILLED']

  # Open the output file
  with open(file_out, 'w') as csvfile:
    
    
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    
    # Open the input file
    with open(file_in, 'rU') as csvfile:     
      
      reader = csv.DictReader(csvfile)
      
      for row in reader:
        # If a new date then log the sum
        if field['DATE'] != row['DATE'] and len(field['DATE'])>0:
          print field['DATE']
          writer.writerow({ 'DATE': datetime.strptime(field['DATE'], '%m/%d/%y').date(),
                            'NUMBER_OF_PERSONS_INJURED': field['NUMBER_OF_PERSONS_INJURED'],
                            'NUMBER_OF_PERSONS_KILLED': field['NUMBER_OF_PERSONS_KILLED'],
                            'NUMBER_OF_PEDESTRIANS_INJURED': field['NUMBER_OF_PEDESTRIANS_INJURED'],
                            'NUMBER_OF_PEDESTRIANS_KILLED': field['NUMBER_OF_PEDESTRIANS_KILLED'],
                            'NUMBER_OF_CYCLIST_INJURED': field['NUMBER_OF_CYCLIST_INJURED'],
                            'NUMBER_OF_CYCLIST_KILLED': field['NUMBER_OF_CYCLIST_KILLED'],
                            'NUMBER_OF_MOTORIST_INJURED': field['NUMBER_OF_MOTORIST_INJURED'],
                            'NUMBER_OF_MOTORIST_KILLED': field['NUMBER_OF_MOTORIST_KILLED'],
                            })

          # Clear the fields
          field['NUMBER_OF_PERSONS_INJURED'] = 0
          field['NUMBER_OF_PERSONS_KILLED'] = 0
          field['NUMBER_OF_PEDESTRIANS_INJURED'] = 0
          field['NUMBER_OF_PEDESTRIANS_KILLED'] = 0
          field['NUMBER_OF_CYCLIST_INJURED'] = 0
          field['NUMBER_OF_CYCLIST_KILLED'] = 0
          field['NUMBER_OF_MOTORIST_INJURED'] = 0
          field['NUMBER_OF_MOTORIST_KILLED'] = 0
        
        # Get new date, sum other fields
        field['DATE'] = row['DATE'];
        field['NUMBER_OF_PERSONS_INJURED'] += int(row['NUMBER_OF_PERSONS_INJURED'])
        field['NUMBER_OF_PERSONS_KILLED'] += int(row['NUMBER_OF_PERSONS_KILLED'])
        field['NUMBER_OF_PEDESTRIANS_INJURED'] += int(row['NUMBER_OF_PEDESTRIANS_INJURED'])
        field['NUMBER_OF_PEDESTRIANS_KILLED'] += int(row['NUMBER_OF_PEDESTRIANS_KILLED'])
        field['NUMBER_OF_CYCLIST_INJURED'] += int(row['NUMBER_OF_CYCLIST_INJURED'])
        field['NUMBER_OF_CYCLIST_KILLED'] += int(row['NUMBER_OF_CYCLIST_KILLED'])
        field['NUMBER_OF_MOTORIST_INJURED'] += int(row['NUMBER_OF_MOTORIST_INJURED'])
        field['NUMBER_OF_MOTORIST_KILLED'] += int(row['NUMBER_OF_MOTORIST_KILLED'])
      
      # Output last row
      print field['DATE']
      writer.writerow({ 'DATE': datetime.strptime(field['DATE'], '%m/%d/%y').date(),
                            'NUMBER_OF_PERSONS_INJURED': field['NUMBER_OF_PERSONS_INJURED'],
                            'NUMBER_OF_PERSONS_KILLED': field['NUMBER_OF_PERSONS_KILLED'],
                            'NUMBER_OF_PEDESTRIANS_INJURED': field['NUMBER_OF_PEDESTRIANS_INJURED'],
                            'NUMBER_OF_PEDESTRIANS_KILLED': field['NUMBER_OF_PEDESTRIANS_KILLED'],
                            'NUMBER_OF_CYCLIST_INJURED': field['NUMBER_OF_CYCLIST_INJURED'],
                            'NUMBER_OF_CYCLIST_KILLED': field['NUMBER_OF_CYCLIST_KILLED'],
                            'NUMBER_OF_MOTORIST_INJURED': field['NUMBER_OF_MOTORIST_INJURED'],
                            'NUMBER_OF_MOTORIST_KILLED': field['NUMBER_OF_MOTORIST_KILLED'],
                            })
        

  

    


#-----------------------------#
#        INITIALIZE
#-----------------------------#
if __name__ == "__main__":
  main()

