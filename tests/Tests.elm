module Tests exposing (..)

import Interfaces.InterfaceTest as InterfaceTest
import Interfaces.DependencyTests as DependencyTests
import Analyser.PostProcessingTests as PostProcessingTests
import Test exposing (Test)
import Parser.Tests as ParserTests
import Analyser.Checks.UnusedVariableTests


all : Test
all =
    Test.concat
        [ InterfaceTest.all
        , DependencyTests.all
        , PostProcessingTests.all
        , ParserTests.all
        , Analyser.Checks.UnusedVariableTests.all
        ]
