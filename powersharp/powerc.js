#!/usr/local/bin/node
const process = require('process')
const args = process.argv.slice(2)
const fs = require('fs')
const fse = require('fs-extra')
const ast_lexer_parser = require('./powerlibs/ast-lexer-parser')
const codegen = require('./powerlibs/codegen')
const token_table = require('./powerlibs/token_table')
const { execSync } = require('child_process')


const gobuild = (source, platform, arch) => {
    if (platform == undefined && arch == undefined) {
        execSync(`go build -o build/${source} main`)
    } else {
        if (arch == undefined) {
            execSync(`env GOOS=${platform} go build -o build/${source} main`)
        } else {
            execSync(`env GOOS=${platform} GOARCH=${arch} go build -o build/${source} main`)
        }
    }
    
}
const gorun = (source) => {
    execSync(`go run ${source}`)
}
const new_project = (name) => {
    if (process.platform == 'win32') {
        let srcDir = token_table.tokens.power_sample_win32
        execSync(`xcopy ${srcDir.replace('/', '\\')} ${name.replace('/','\\')} /E /H /C /I`)
    } else {
        let srcDir = token_table.tokens.power_sample
        execSync(`cp -Rfv ${srcDir} ${name}`)
    }
}


if (args[1] == '-ast') {
    console.log(ast_lexer_parser.GenerateAST(args[0]))

} else if (args[1] == '-c') {
    codegen.CodeGen(args[0], args[2], 'normal')
} else if (args[1] == '-c-ast') {
    codegen.CodeGen(args[0], args[2], 'debugging')


} else if (args[1] == '-o') {
    codegen.CodeGen(args[0], args[2]+'.go', 'normal')
    if (args[3] == undefined) {
        gobuild(args[2])
    }
    
    


} else if (args[1] == '-o-ast') {
    codegen.CodeGen(args[0], args[2]+'.go', 'debugging')
    gobuild(args[2])

} else if (args[1] == '-run') {
    codegen.CodeGen(args[0], args[2], 'normal')
    gorun(args[2])
} else if (args[1] == '-run-ast') {
    codegen.CodeGen(args[0], args[2], 'debugging')
    gorun(args[2])
    
} else if (args[0] == '-new') {
    new_project(args[1])


} else {
    console.log("\n                        POWERC")
    console.log("------------------------------------------------------")
    console.log("Syntax:       powerc  <options>")
    console.log("------------------------------------------------------\n\n")

    console.log("The Platforms are:")
    console.log("linux               GNU/Linux")
    console.log("windows             Microsoft Windows")
    console.log("darwin              Apple MacOS X")
    console.log("openbsd             OpenBSD")
    console.log("netbsd              NetBSD")
    console.log("dragonfly           DragonflyBSD")
    console.log("solaris             SunOS/Solaris")
    console.log("android             Android")
    console.log("javascript          JS")
    console.log("aix                 AIX")
    console.log("illumos             Illumos")
    console.log("plan9               Plan9\n\n")


    console.log("The Architecures are:")
    console.log("386                 x86 (32-bit)")
    console.log("amd64               x86 (64-bit)")
    console.log("arm                 ARM (32-bit)")
    console.log("arm64               ARM (64-bit)\n")


    console.log("ppc                 PowerPC (32-bit)")
    console.log("ppc64               PowerPC (64-bit)")
    console.log("ppc64l3             PowerPC LE (64-bit)\n")


    console.log("sparc               SPARC (32-bit)")
    console.log("sparc64             SPARC (64-bit)\n")


    console.log("riscv               RISC-V (32-bit)")
    console.log("riscv64             RISC-V (64-bit)\n")

    console.log("s390                S390")
    console.log("s390x               S390x\n")

    console.log("sparc               SPARC (32-bit)\n")

    console.log("arm64be             ARM BE(64-bit)\n")

    console.log("loong64             LOONG (64-bit)\n")

    console.log("mips                MIPS (32-bit)")
    console.log("mips64              MIPS (64-bit)")
    console.log("mips64le            MIPS LE (64-bit)")
    console.log("mips64p32           MIPS P32 (64-bit)")
    console.log("mips64p32le         MIPS P32LE (64-bit)")
    console.log("mipsle              MIPS LE\n\n")

    console.log("wasm                WebAssembly\n\n")
    

    console.log("--------------------------------------------------------------------------------\n\n")
    console.log("The options are:")
    console.log("-new  <project_name>                   Create new project\n\n")

    console.log("<file>.pwr   -o    <file>              Output is a binary\n")

    console.log("<file>.pwr   -o    <file>   <Platform>  <Arch>")
    console.log("                                   Output is a (cross-compiled)")
    console.log("                                   platform and architecture binary\n") 

    console.log("<file>.pwr   -c    <file>.go       Output is a golang compiled code\n")
    
    console.log("<file>.pwr   -run  <file>.go       Run source using `go run`")
    console.log("<file>.pwr   -ast                  Show generated Abstract Syntax Tree (AST)\n")

    console.log("<file>.pwr   -o-ast  <file>        Show generated Abstract Syntax Tree (AST)")
    console.log("                                   and output is a binary\n\n")
    
    console.log("<file>.pwr   -c-ast  <file>.go     Show generated Abstract Syntax Tree (AST)")
    console.log("                                   and output is a golang compiled code\n\n")
    
    console.log("<file>.pwr   -run-ast  <file>.go   Run source using `go run`")
    console.log("                                   and show Abstract Syntax Tree (AST)")
    console.log("--------------------------------------------------------------------------------\n\n")
}

