#!/usr/local/bin/node



/*
 * WARNING!
 * AST: This program translates sources to AST.
 * Gabriel Margarido - BSD 2-clause license
 */
const fs = require('fs')
const process = require('process')
const util = require('util')
const dump = util.inspect
const token_table = require('./token_table')



/* Generate AST from text source-file */
let var_collection = []
let typedef_colection = []
let func_collection = [ // Put all custom functions here, first!
    'puts','p','print'
]


let import_collection = []
let linecounter = 0     // Used for error handling!

function GenerateAST(input) {
    let regex = /[A-Za-z0-9_$++::.,@*#?><>=<=>{}===:=\[\]]+|"[^"]+"|'[^']+'|\([^)]*\)|\[[^\]]*\]|\/[^)/]*\/|(:)|(=)/g
    let source = fs.readFileSync(input,'utf8')
    let json = []


    source.split(/\r?\n/).forEach(line =>  {
        linecounter = linecounter +1
        let stack = line.match(regex)

        /**
         * @error  stack.lenght
         * @fix    stack?.length
         */
        //console.log("Lines:")
        //console.log(" ->"+stack+" ")

        for (let i = 0; i < stack?.length; i++) {
            //process.stdout.write("Token: ["+stack[i]+"] ~ ")
            if (stack[i] == token_table.tokens.initialize_program) {
                if (stack[i+1] == undefined) {
                    console.log("Syntax-Error: namespace identifier was not defined - error on line:"+linecounter)
                } else {
                    let data = {
                        token: token_table.tokens.initialize_program,
                        name: stack[i+1],
                        type: 'initialize_program'
                    }
                    json.push(data);
                }

            }
            if (stack[i] == token_table.tokens.package_definition) {
                if (stack[i+1] == undefined) {
                    console.log("Syntax-Error: package identifier was not defined - error on line:"+linecounter)
                } else {
                    let data = {
                        token: token_table.tokens.package_definition,
                        name: stack[i+1],
                        type: 'package_definition'
                    }
                    json.push(data);
                }

            }

            // End block
            else if (stack[i] == token_table.tokens.end_block) {
                let data = {
                    token: token_table.tokens.end_block,
                    type: 'end_block'
                }
                json.push(data);
                
            }
            else if (stack[i] == token_table.tokens.open_block) {
                let data = {
                    token: token_table.tokens.open_block,
                    type: 'open_block'
                }
                json.push(data);
            }

            // Comentarios
            else if (stack[i] == token_table.tokens.commentary) {
                let data = {
                    token: token_table.tokens.commentary,
                    type: 'commentary',
                    commentary: line.trim().slice(2)
                }
                json.push(data);
            }
                

            // Declaração de variaveis e vetores
            else if (stack[i] == token_table.tokens.variable_assignment) {
                let vartype = stack[i-2]
                let varname = stack[i-1]
                //let value = stack[i+1]
                let value = line.slice(line.indexOf('=')+2)
                value = value.replace(/nil/g, null)
                
                if (var_collection.includes(varname)) {
                    console.log("Semantic-Error: variable or array ("+varname+") was already declared - error on line:"+linecounter)
                    break
                } else {
                    if (varname.includes(token_table.tokens.array_symbol.slice(0,1))
                    && varname.includes(
                        token_table.tokens.array_symbol.slice
                        (-1,token_table.tokens.array_symbol.length)
                    )) {
                        let data = {
                            token: token_table.tokens.variable_assignment,
                            type: 'array_assignment',
                            data: {
                                vartype: vartype,
                                varname: varname.slice(0,
                                    varname.indexOf(token_table.tokens.array_symbol.slice(0,1))
                                ),
                                sizeof: varname.slice(
                                    varname.indexOf(token_table.tokens.array_symbol.slice(0,1),
                                    varname.indexOf(token_table.tokens.array_symbol.slice(-2,token_table.tokens.array_symbol.length)))
                                ),
                                value: value
                            }
                        }
                        json.push(data);
                    } else {
                        // Searching for errors
                        if (vartype == token_table.tokens.typedef_integer && isNaN(value) == true) {
                            console.log("Semantic-Error: variable ("+varname+") has incompatible datatype (Integer to Non-Number value) - error on line:"+linecounter)
                            break
                        } else if (vartype == token_table.tokens.typedef_float && isNaN(value) == true) {
                            console.log("Semantic-Error: variable ("+varname+") has incompatible datatype (Float to Non-Number value) - error on line:"+linecounter)
                            break
                        } else if (vartype == token_table.tokens.typedef_string && typeof value != 'string') {
                            console.log("Semantic-Error: variable ("+varname+") has incompatible datatype (String to Non-String value) - error on line:"+linecounter)
                            break
                        // If everything is Ok, then generate AST.
                        } else {
                            /*value = value.replace(/MokaScript\.toInteger/g, 'parseInt')
                            value = value.replace(/MokaScript\.toFloat/g, 'parseFloat')*/
                            if (vartype == undefined) { vartype = ''}


                            let data = {
                                token: token_table.tokens.variable_assignment,
                                type: 'variable_assignment',
                                data: {
                                    vartype: vartype,
                                    varname: varname,
                                    value: value
                                }
                            }
                            json.push(data);
                            var_collection.push(varname)
                            typedef_colection.push(vartype)
                        }
                        
                    }
                }
    
            }

            // Reatribuicao de variaveis   
            else if (stack[i] == token_table.tokens.variable_reassignment) {
                let varname = stack[i-1]
                let value = stack[i+1]
                value = value.replace(/nil/g, '"nil"')

                if (var_collection.includes(varname)) {
                    if (varname.includes(token_table.tokens.array_symbol)) {
                        let data = {
                            token: token_table.tokens.variable_reassignment,
                            type: 'array_reassignment',
                            data: {
                                varname: varname.slice(0,
                                    varname.indexOf(token_table.tokens.array_symbol.slice(0,1))
                                ),
                                value: value
                            }
                        }
                        json.push(data);
                    } else {
                        let data = {
                            token: token_table.tokens.variable_reassignment,
                            type: 'variable_reassignment',
                            data: {
                                varname: varname,
                                value: value
                            }
                        }
                        json.push(data);
                    }
                } else {
                    console.log("Sematic-Error: Trying to access variable or array ("+varname+") before it's initialization - line:"+linecounter)
                    break
                }
                
            }

            else if (stack[i] == token_table.tokens.package_importing) {
                let path = stack[i+1]
                let cpath = stack[i+1].slice(1,-1)
                let alias

                // Setting alias
                if (path.includes('/')) {
                    alias = path.slice(path.lastIndexOf('/')+1,-1)
                } else {
                    alias = path.slice(1,-1)
                }

                // Doing the work
                if (import_collection.includes(path)) {
                    console.log("Semantic-Error: ("+path+") was already imported! - line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.package_importing,
                        type: 'package_importing',
                        data: {
                            path: path,
                            alias: alias,
                            cpath: cpath
                        }
                    }
                    json.push(data);
                    import_collection.push(path)
                }
            }

            else if (stack[i] == token_table.tokens.package_including) {
                let path = stack[i+1].slice(1,-1)

                // Doing the work
                if (import_collection.includes(path)) {
                    console.log("Semantic-Error: ("+path+") was already included! - line:"+linecounter)
                    break
                } else {
                    // GLOBAL MODULES - UNSED BEGIN
                    /*if (fs.existsSync(token_table.tokens.power_modules+'/'+path+'.go')) {
                        path = token_table.tokens.power_modules+'/'+path+'.go'
                        let data = {
                            token: token_table.tokens.package_importing,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);

                    }*/
                    // GLOBAL MODULES - UNSED END


                    if (fs.existsSync(token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module)) {
                        path = token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module
                        let data = {
                            token: token_table.tokens.package_including,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);
                        
                    } else if (fs.existsSync(path)) {
                        let data = {
                            token: token_table.tokens.package_including,
                            type: 'package_including',
                            data: {
                                path: path
                            }
                        }
                        json.push(data);

                    } else {
                        console.log("Syntax-Error: File ("+path+") or ("+token_table.tokens.local_modules+'/'+path+'/'+token_table.tokens.init_module+") does not exist (from current directory: ./... )!")
                        break
                    }
                }
            }

            else if (stack[i] == token_table.tokens.function_definition) {
                let funcname = stack[i+1]
                let args = stack[i+2]
                let functype = stack[i+3]

                if (func_collection.includes(funcname)) {
                    console.log("Semantic-Error: Function ("+funcname+") was already declared!")
                    break
                } /*else if (functype != "string" || functype != undefined) {
                    console.log("Syntax-Error: Invalid datatype ("+functype+") on line:"+linecounter)
                    break

                }*/ else {
                    args = args.replace(/:/g, ' ')
                    let data = {
                        token: token_table.tokens.function_definition,
                        type: 'function_definition',
                        data: {
                            functype: functype,
                            funcname: funcname,
                            args: args
                        }
                    }
                    json.push(data);
                    func_collection.push(funcname)
                }

            }

            /** Function Return */
            else if (stack[i] == token_table.tokens.return_value) {
                //let value = line.trim().slice(line.indexOf(/\s+/), line.length)
                let value = line.trim().slice(line.indexOf(/\s+/)+1)

                if (var_collection.includes(value)
                || func_collection.includes(value)
                || Number(value) || String(value)) {
                    // It's a variable, function, number or string
                    let data = {
                        token: token_table.tokens.return_value,
                        type: 'return_value',
                        data: {
                            value: value
                        }
                    }
                    json.push(data);

                } else {
                    console.log("Semantic-Error: Trying to return unknown value ("+value+") at line:"+linecounter)
                    break
                }

            }


            /* Function call based on parenthesis
            <function> <identifier><params>
            != <identifier><params> */
            else if (stack[i].slice(0,1) == '('
            && stack[i-1].match(/[A-Za-z0-9]/)
            && stack[i-2] == undefined
            && stack[i+1] != token_table.tokens.open_block) {
                let funcname = stack[i-1]
                //let args = stack[i]   // Old args

                /**
                 * Now multiple parenthesis are supported!
                 */
                let args = line.trim().slice(stack[i-1].length)

                
                //if (func_collection.includes(funcname)) {
                    funcname = funcname.replace(/puts/g, 'fmt.Println')
                    funcname = funcname.replace(/print/g, 'fmt.Print')
                    funcname = funcname.replace(/gets/g, 'fmt.Scanln')
                    args = args.replace(/nil/g, '"nil"')

                    let data = {
                        token: '<function_call>',
                        type: 'function_call',
                        data: {
                            funcname: funcname,
                            args: args
                        }
                    }
                    json.push(data);
                /*} else {
                    console.log("Semantic-Error: Trying to access ("+funcname+") before it's declaration at line:"+linecounter)
                    break
                }*/
                
            }


            // Condicionais
            else if (stack[i] == token_table.tokens.conditional_if) {
                let expression = stack[i+1]

                // Novos operadores
                //expression = expression.replace(/ is true/gi,"")

                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                //expression = expression.replace(/ and /gi," and ")
                //expression = expression.replace(/ or /gi," .or ")
                //expression = expression.replace(/not /gi,"!")
                //expression = expression.replace(/let /gi,'$')

                if (stack[i+2] != token_table.tokens.open_block) {
                    console.log("Syntax-Error: Expected 'do' after 'if' at line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.conditional_if,
                        type: 'conditional_if',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                }
                
            }

            else if(stack[i] == token_table.tokens.conditional_elsif) {
                let expression = stack[i+1]
                let ContainsDo = stack[i+2]

                // Novos operadores
                //expression = expression.replace(/ is true/gi,"")

                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                /*expression = expression.replace(/ and /gi," .and ")
                expression = expression.replace(/ or /gi," .or ")
                expression = expression.replace(/not /gi,"!")*/
                //expression = expression.replace(/let /gi,'$')


                if (stack[i+2] != token_table.tokens.open_block) {
                    console.log("Syntax-Error: Expected 'do' after 'elsif' at line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.conditional_elsif,
                        type: 'conditional_elsif',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                }
            }
            else if (stack[i] == token_table.tokens.conditional_final) {
                let data = {
                    token: token_table.tokens.conditional_final,
                    type: 'conditional_final'
                }
                json.push(data);

            }
            else if (stack[i] == token_table.tokens.loop_while) {
                let expression = stack[i+1]

                // Novos operadores
                //expression = expression.replace(/ is true/gi,"")

                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                //expression = expression.replace(/ and /gi," .and ")
                //expression = expression.replace(/ or /gi," .or ")
                //expression = expression.replace(/not /gi,"!")*/
                //expression = expression.replace(/let /gi,'$')

                if (stack[i+2] != token_table.tokens.open_block) {
                    console.log("Syntax-Error: Expected 'do' after 'while' at line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.loop_while,
                        type: 'loop_while',
                        data: {
                            expression: expression
                        }
                    }
                    json.push(data);
                    
                }
            }
            else if (stack[i] == token_table.tokens.times) {
                let iterator = 'i'
                let Max = stack[i-1]

                if (stack[i+1] != token_table.tokens.open_block) {
                    console.log("Syntax-Error: Expected 'do' after '"+Max+" times' at line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.times,
                        type: 'loop_times',
                        data: {
                            iterator: iterator,
                            minimum_value: 0,
                            maximum_value: Max
                        }
                    }
                    json.push(data);
                }
                
            }
            else if (stack[i] == token_table.tokens.loop_for) {
                let iterator = stack[i+1]
                let Min = stack[i+2]
                let Max = stack[i+4]

                if (stack[i+3] != token_table.tokens.to_for) {
                    console.log("Syntax-Error: Expected 'to' after 'for' and before '"+Max+"' at line:"+linecounter)
                    break
                } else {
                    let data = {
                        token: token_table.tokens.loop_for,
                        type: 'loop_for',
                        data: {
                            iterator: iterator,
                            minimum_value: Min,
                            maximum_value: Max
                        }
                    }
                    json.push(data);
                }
                
            }

            //Interromper ciclos
            else if (stack[i] == token_table.tokens.break_loop) {
                let data = {
                    token: token_table.tokens.break_loop,
                    type: 'break_loop'
                }
                json.push(data);
            }
            else if (stack[i] == token_table.tokens.continue_loop) {
                let data = {
                    token: token_table.tokens.continue_loop,
                    type: 'continue_loop'
                }
                json.push(data);
            }






            /*else {
                // Error handling
                if (stack[i] == /[A-Z][a-z][0-9]/) {
                    if (
                        stack[i-1] != /namespace|if|elsif|while/
                    ) {
                        console.log("1 Error unknown expression: "+stack[i])
                    } else {
                        return json
                    }
                }

            }*/




            
        }
    })
    return json
    //console.log(dump(json, {depth: null}))
    
}

module.exports = { GenerateAST, var_collection, func_collection, import_collection }