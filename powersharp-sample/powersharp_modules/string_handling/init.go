/** Requires "strings" importing */
/* package string */

/* Does a string includes another? */
func Includes(s string, token string) bool {
	return strings.Contains(s, token)
}
/* How many (char) inside the string */
func HowMany(char string, str string) int {
	return strings.Count(char, str)
}
func Length(char string) int {
	return len([]rune(char))
}

/* Get substring from a string */
func Substring(str string, begin int, last int) string {
	/*if begin == "nil" {
		return str[:last]
	} else if last == "nil" {
		return str[begin:]
	} else {
		return str[begin:last]
	}*/

	return str[begin:last]
}
/* Put into lowercase/uppercase */
func Lowercase(str string) string {
	return strings.ToLower(str)
}
func Uppercase(str string) string {
	return strings.ToUpper(str)
}

/* Replace a pattern to another globally inside a string */
func GlobalReplacement(str string, pattern string, result string) string {
	return strings.ReplaceAll(str, pattern, result)
}

/* Compare one string to another */
/* func IsEqual(str string, pattern string) bool {
	return strings.Compare(str, pattern)
} */

/* Get index of character on the string (start:0) */
func GetIndexOf(str string, char string) int {
	return strings.Index(str, char)
}


/*
* Remove /\s/ (whitespace) or any other character between the string
* at the beggining and the end.
*/
func Trimming(str string, char string) string {
	if char == "nil" {
		char = " "
	}
	return strings.Trim(str, char)
}



