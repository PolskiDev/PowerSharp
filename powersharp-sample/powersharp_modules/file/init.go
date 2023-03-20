func ReadFile(file string) string {
	// read in the contents of the localfile.data
    data, err := ioutil.ReadFile(file)
    // if our program was unable to read the file
    // print out the reason why it can't
    if err != nil {
        fmt.Println(err)
    }
	return string(data[:])
}
func WriteToFile(file string, text string) {
	// the WriteFile method returns an error if unsuccessful
	err := ioutil.WriteFile(file, []byte(text), 0777)
	// handle this error
	if err != nil {
		// print it out
		fmt.Println(err)
	}
}
func AppendToFile(file_path string, text string) {
	file,err := os.OpenFile(file_path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    
    if err != nil {
		fmt.Println(err)
      	return
	}

	defer file.Close()
	 
    _, err2 := file.WriteString(text)

	if err2 != nil {
		fmt.Println(err2)
	}
}


