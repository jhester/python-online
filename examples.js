var examples = [{
	name : "Hello, World",
	code : '# Say hello\nprint "Hello, World"'
},{
	name : 'Strings',
	code : '# String concatentation and printing\nx = "Hello, World"\ny = "Hello, Piethon"\n\nprint x + ", or, " + y'
},{
	name : "Math",
	code : "'''This program tests if assignment works.\nTests if printing identifiers works.\nTests various math operations'''\n\nx = 23 / 2 + 15.0 % 3.0 ** 2 * -4\ny = 6\nz = y / 2\nprint 5\nprint x\nprint y\nprint z"
}, {
	name : "Conditionals",
	code: "'''This program tests selection statements.\n\tIf and If-else, as well as boolean evaluations, <, > !=, ==, etc.'''\ny = 6\nif 5 > 1:\n\tprint 7\nend\nx = 20.0\nif x < 1000:\n\tprint x\nelse: \n\tprint 10\nend\nif x == 2:\n\tif y != x:\n\t\tprint 3\n\tend\nelse:\n\tprint y\nend\nif y >= 5:\n\tprint y\nend\n\nif y <= 6:\n\tprint y\nend"
}, {
	name : 'Looping',
	code : "'''This program tests looping with\n\twhile!'''\na = 0\nwhile a < 5:\n\t# increment by 1\n    a = a + 1\n    print a\nend\n"
},{
	name : 'Functions',
	code : "'''This program tests calling functions without arguments. \n\tFirst test case that uses execution stack and stack frames.\n\tThis is to check that we have everything scoped locally correctly.'''\t\ndef g():\n\tx = 30\n\tprint x\nend\n\ndef f():\n\tx = 20\n\tprint 5\n\tg()\n\tprint x\nend\n\nx = 10\nf()\nprint x\n"
},{
	name : "Arguments",
	code : "'''This program tests calling functions WITH arguments / parameters.\n\tAlso tests whether we check to see if number of arguments is correct'''\t\ndef h(a,b,c,d,e,f,g):\n\tprint a\n\tprint b\n\tprint c\n\tprint d\n\tprint e\n\tprint f\n\tprint g\nend\n\ndef g(z):\n\tprint z\nend\ndef f(x, z):\n\ty = x / 2\n\tprint x\n\tprint y\n\tprint z\n\tg(z)\n\tx = x - 1\n\tg(x)\nend\n\t\t\nx = 10\nf(14,x)\nprint x\nh(1,2,3,4,5,6,x)\n"
}, {
	name : 'Fibonnaci',
	code : "'''This program tests recursion by calculating the fibbonacci sequence!\n\tThis has a prerequisite of testing return values.'''\t\n\ndef fibonnaci(n):\n\tif n == 0:\n\t\treturn 0\n\telse:\n\t\tif n == 1:\n\t\t\treturn 1\n\t\telse:\n\t\t\tn1 = n-1\n\t\t\tn2 = n-2\n\t\t\tf1 = fibonnaci(n1)\n\t\t\tf2 = fibonnaci(n2)\n\t\t\treturn  f1 + f2\n\t\tend\n\tend\t\nend\n\n\na = fibonnaci(0)\nprint a\na = fibonnaci(1)\nprint a\na = fibonnaci(2)\nprint a\na = fibonnaci(3)\nprint a\na = fibonnaci(4)\nprint a\na = fibonnaci(5)\nprint a\n"
},{
	name : 'Factorial',
	code : "'''Simple factorial, uses recursion wooo'''\ndef factorial(n):\n    if n < 2:\n        return 1\n    else:\n        n1 = n - 1\n        f = factorial(n1)\n        return n * f \n    end\nend\n\nx = factorial(10)\nprint x"
}, {
	name : 'Lists',
	code : '\'\'\'Testing out the use of arrays\n\tObviously limited, since we dont have classes.\n\tWe can only create, assign by index, fetch by index and use a limited number of operations\'\'\'\ndef test(array):\n\tarray.append(11)\n\treturn array\nend\n\ndef clear(array):\n\twhile len(array) > 0:\n\t\tarray.pop()\n\tend\n\treturn array\nend\n\n\nb = 9\na = [1,b,3.2,4,5.2,6,7,8]\nd = []\nprint a\nprint a[0]\nc = a[4]\nprint c\na[5] = 22\nprint a[5]\nprint a\n# empty list test\nprint "empty list: " + d\n# length of a list test\ne = len(a)\nprint "Length : " + e\n# this throws an error len(b)\n\nd.append(2)\nd.append(6)\nprint "Appended 2, 6 "\nprint d\nd.pop()\nprint "Pop"\nprint d\nd = test(d)\nprint d\na = clear(a)\nprint a'
}];