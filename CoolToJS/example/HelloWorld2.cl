class Main inherits IO {
    main(): Object {
        let hello: String <- "Hello, ",
            name: String <- "",
            ending: String <- "!\n"
        in {
            out_string("Please enter your name:\n");
            name <- in_string();
            out_string(hello.concat(name.concat(ending)));
        }
    };
};