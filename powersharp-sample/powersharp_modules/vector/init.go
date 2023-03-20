func RemoveArrayFromIndex(s []int, index int) []int {
    return append(s[:index], s[index+1:]...)
}
func RemoveArrayFromValue(s []int, i int) []int {
    s[i] = s[len(s)-1]
    return s[:len(s)-1]
}


