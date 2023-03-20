func ShellCommand(command string, isOutput bool) {
    // here we perform the pwd command.
    // we can store the output of this in our out variable
    // and catch any errors in err
    outshell, err := exec.Command(command).Output()

    // if there is an error with our execution
    // handle it here
    if err != nil {
        fmt.Printf("%s", err)
    }
    // as the out variable defined above is of type []byte we need to convert
    // this to a string or else we will see garbage printed out in our console
    // this is how we convert it to a string

	if isOutput == true {
		output := string(outshell[:])
		fmt.Println(output)
	}
    
}
func GetOS() {
	/*
	 *  -> "windows"
	 *  -> "linux"
	 *  -> "darwin"
	 *  -> "freebsd"
	 *  -> "openbsd"
	 *  -> "netbsd"
	 *  -> "dragonfly"

	 *  -> "solaris"

	 *  -> "zos"
	 *  -> "plan9"

	 *  -> "hurd"
	 *  -> "illumos"
	 *  -> "nacl"

	 *  -> "js"
	 *  -> "ios"
	 *  -> "android"
	 *  -> "aix"
	 */
	return runtime.GOOS
}


func GetArch() {
	/*
	 *  -> "386"
	 *  -> "amd64"
	 *  -> "amd64p32"
	 *  -> "arm"
	 *  -> "arm64"
	 *  -> "arm64be"
	 *  -> "loong64"
	 *  -> "mips"
	 *  -> "mips64"
	 *  -> "mips64le"
	 *  -> "mips64p32"
	 *  -> "mips64p32le"
	 *  -> "mipsle"
	 *  -> "ppc"
	 *  -> "ppc64"
	 *  -> "ppc64le"
	 *  -> "riscv"
	 *  -> "riscv64"
	 *  -> "s390"
	 *  -> "s390x"
	 *  -> "sparc"
	 *  -> "sparc64"
	 *  -> "wasm"
	 */
	return runtime.GOARCH
}



