import * as tsUnit from './Scripts/tsUnit/tsUnit';
import * as FizzBuzzTests from './Scripts/FizzBuzzTests';
import * as FizzBuzzParameterisedTests from './Scripts/FizzBuzzParameterisedTests';

var test = new tsUnit.Test(FizzBuzzTests, FizzBuzzParameterisedTests).run().showResults('result');