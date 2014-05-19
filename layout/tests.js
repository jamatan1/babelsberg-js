module('users.timfelgentreff.layout.tests').requires('lively.TestFramework', 'users.timfelgentreff.babelsberg.constraintinterpreter', 'users.timfelgentreff.layout.layout').toRun(function() {

TestCase.subclass('users.timfelgentreff.layout.tests.SimpleLayoutTest', {
    fixtureSameExtent: function() {
        this.layoutSolver = new LayoutSolver();
        
        var parent = new lively.morphic.Box(pt(7,7).extent(pt(300,300)));
        parent.addMorph(parent.child1 = new lively.morphic.Morph.makeRectangle(10, 10, 100, 250));
        parent.addMorph(parent.child2 = new lively.morphic.Morph.makeRectangle(150, 10, 130, 200));

        bbb.always({
            solver: this.layoutSolver,
            allowUnsolvableOperations: true,
            allowTests: true,
            debugging: true,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.getExtent().eqPt(parent.child2.getExtent());;
        });
        
        return parent;
    },
    testSameExtent: function () {
        var parent = this.fixtureSameExtent();

        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after constraint definition.");
    },
    
    testSameExtentAssignmentLeft: function () {
        var parent = this.fixtureSameExtent();
        var expectedExtent = pt(70,35);
        parent.child1.setExtent(expectedExtent);
        
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "child1 and child2 do not have the same extent after assignment.");
        this.assertEquals(expectedExtent, parent.child1.getExtent(), "child1 does not have the assigned extent.");
        this.assertEquals(expectedExtent, parent.child2.getExtent(), "child2 does not have the assigned extent.");
    },
    testSameExtentAssignmentRight: function () {
        var parent = this.fixtureSameExtent();
        var expectedExtent = pt(70,35);
        parent.child2.setExtent(expectedExtent);
        
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "child1 and child2 do not have the same extent after assignment.");
        this.assertEquals(expectedExtent, parent.child1.getExtent(), "child1 does not have the assigned extent.");
        this.assertEquals(expectedExtent, parent.child2.getExtent(), "child2 does not have the assigned extent.");
    }
});

TestCase.subclass('users.timfelgentreff.layout.tests.ConstainedVariablesTest', {
    /*
     * Creates a Box with 2 child Boxes constrained to the same extent.
     */
    fixtureSameExtent: function() {
        this.layoutSolver = new LayoutSolver();
        
        var parent = new lively.morphic.Box(pt(7,7).extent(pt(300,300)));
        parent.addMorph(parent.child1 = new lively.morphic.Morph.makeRectangle(10, 10, 100, 250));
        parent.addMorph(parent.child2 = new lively.morphic.Morph.makeRectangle(150, 10, 130, 200));

        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.sameExtent(parent.child2);;
        });

        return parent;
    },
    testbbbCompoundConstraintVariables: function () {
        var parent = this.fixtureSameExtent();
        
        var morphCvar = ConstrainedVariable.findConstraintVariableFor(parent, "child1");
        var shapeCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1, "shape");
        var extentCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape, "_Extent");
        var xCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape._Extent, "x");
        var yCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape._Extent, "y");

        this.assertIdentity(morphCvar, shapeCvar.parentConstrainedVariable);
        this.assertIdentity(shapeCvar, extentCvar.parentConstrainedVariable);
        this.assertIdentity(extentCvar, xCvar.parentConstrainedVariable);
        this.assertIdentity(extentCvar, yCvar.parentConstrainedVariable);
    },
    testLayoutCompoundConstraintVariables: function () {
        var parent = this.fixtureSameExtent();
        
        var morphCvar = ConstrainedVariable.findConstraintVariableFor(parent, "child1");
        var shapeCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1, "shape");
        var extentCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape, "_Extent");
        var xCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape._Extent, "x");
        var yCvar = ConstrainedVariable.findConstraintVariableFor(parent.child1.shape._Extent, "y");

        var morphLayoutCvar = morphCvar.externalVariables(this.layoutSolver);
        var shapeLayoutCvar = shapeCvar.externalVariables(this.layoutSolver);
        var extentLayoutCvar = extentCvar.externalVariables(this.layoutSolver);
        var xLayoutCvar = xCvar.externalVariables(this.layoutSolver);
        var yLayoutCvar = yCvar.externalVariables(this.layoutSolver);
        
        this.assertIdentity(morphLayoutCvar, shapeLayoutCvar.__parent__);
        this.assertIdentity(shapeLayoutCvar, extentLayoutCvar.__parent__);
        this.assertIdentity(extentLayoutCvar, xLayoutCvar.__parent__);
        this.assertIdentity(extentLayoutCvar, yLayoutCvar.__parent__);
    }
});

/*
 * Solver specific
 */
TestCase.subclass('users.timfelgentreff.layout.tests.SameExtentTest', {
    /*
     * Creates a Box with 2 child Boxes constrained to the same extent.
     */
    fixtureSameExtent: function() {
        this.layoutSolver = new LayoutSolver();
        
        var parent = new lively.morphic.Box(pt(7,7).extent(pt(300,300)));
        parent.addMorph(parent.child1 = new lively.morphic.Morph.makeRectangle(10, 10, 100, 250));
        parent.addMorph(parent.child2 = new lively.morphic.Morph.makeRectangle(150, 10, 130, 200));

        bbb.always({
            solver: this.layoutSolver,
            allowUnsolvableOperations: true,
            ctx: {
                parent: parent,
            allowUnsolvableOperations: true,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.sameExtent(parent.child2);;
        });

        return parent;
    },
    testSameExtent: function () {
        var parent = this.fixtureSameExtent();
        
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after constraint definition.");
    },
    testSameExtentAssignmentLeft: function () {
        var parent = this.fixtureSameExtent();
        var expectedExtent = pt(70,35);
        parent.child1.setExtent(expectedExtent);
        
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after assignment.");
        this.assertEquals(expectedExtent, parent.child1.getExtent(), "Box does not have the assigned extent.");
        this.assertEquals(expectedExtent, parent.child2.getExtent(), "Box does not have the assigned extent.");
    },
    testSameExtentAssignmentRight: function () {
        var parent = this.fixtureSameExtent();
        var expectedExtent = pt(70,35);
        parent.child2.setExtent(expectedExtent);
        
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after assignment.");
        this.assertEquals(expectedExtent, parent.child1.getExtent(), "Box does not have the assigned extent.");
        this.assertEquals(expectedExtent, parent.child2.getExtent(), "Box does not have the assigned extent.");
    },
    test2IndependentSameExtents: function () {
        this.layoutSolver = new LayoutSolver();
        
        var parent = new lively.morphic.Box(pt(7,7).extent(pt(300,300)));
        parent.addMorph(parent.child1 = new lively.morphic.Box(pt(10,10).extent(pt(100,250))));
        parent.addMorph(parent.child2 = new lively.morphic.Box(pt(150,10).extent(pt(130, 200))));
        parent.addMorph(parent.child3 = new lively.morphic.Box(pt(10,10).extent(pt(300,250))));
        parent.addMorph(parent.child4 = new lively.morphic.Box(pt(150,10).extent(pt(330, 200))));

        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.sameExtent(parent.child2);;
        });
        
        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child3.sameExtent(parent.child4);;
        });

        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after constraint definition.");
        this.assertEquals(parent.child3.getExtent(), parent.child4.getExtent(), "Boxes do not have the same extent after constraint definition.");
    }
});

TestCase.subclass('users.timfelgentreff.layout.tests.ChainOfSameExtentTest', {
    /*
     * Creates a Box with 2 child Boxes constrained to the same extent.
     */
    fixtureChainOfSameExtent: function() {
        this.layoutSolver = new LayoutSolver();
        
        var parent = new lively.morphic.Box(pt(7,7).extent(pt(300,300)));
        parent.addMorph(parent.child1 = new lively.morphic.Box(pt(10,10).extent(pt(100,20))));
        parent.addMorph(parent.child2 = new lively.morphic.Box(pt(10,10).extent(pt(200, 40))));
        parent.addMorph(parent.child3 = new lively.morphic.Box(pt(10,10).extent(pt(300,60))));
        parent.addMorph(parent.child4 = new lively.morphic.Box(pt(10,10).extent(pt(400, 80))));

        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.sameExtent(parent.child2);;
        });
        
        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child2.sameExtent(parent.child3);;
        });
        
        bbb.always({
            solver: this.layoutSolver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child3.sameExtent(parent.child4);;
        });
        
        return parent;
    },

    test2ChainOfSameExtents: function () {
        var parent = this.fixtureChainOfSameExtent();

/*        console.log(parent);
        console.log(parent.child1);
        console.log(parent.child1.solver);
        console.log(parent.child1.solver.constraints);
        console.log(parent.child1.value.getExtent().x, parent.child1.value.getExtent().y);
        console.log(parent.child2.value.getExtent().x, parent.child2.value.getExtent().y);
        console.log(parent.child3.value.getExtent().x, parent.child3.value.getExtent().y);
        console.log(parent.child4.value.getExtent().x, parent.child4.value.getExtent().y);
*/
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after constraint definition1.");
        this.assertEquals(parent.child2.getExtent(), parent.child3.getExtent(), "Boxes do not have the same extent after constraint definition2.");
        this.assertEquals(parent.child3.getExtent(), parent.child4.getExtent(), "Boxes do not have the same extent after constraint definition3.");
    },

    testAssignment: function () {
        var parent = this.fixtureChainOfSameExtent();
        var expectedExtent = pt(70,35);
        parent.child2.setExtent(expectedExtent);
        
        this.assertEquals(expectedExtent, parent.child1.getExtent(), "Box does not have the assigned extent.");
        this.assertEquals(parent.child1.getExtent(), parent.child2.getExtent(), "Boxes do not have the same extent after assignment.");
        this.assertEquals(parent.child2.getExtent(), parent.child3.getExtent(), "Boxes do not have the same extent after assignment.");
        this.assertEquals(parent.child3.getExtent(), parent.child4.getExtent(), "Boxes do not have the same extent after assignment.");
    }
});

/*
 *  General
 */
TestCase.subclass('users.timfelgentreff.layout.tests.RecursiveUnconstraintTest', {
    /*
     * Creates a Box with a child Box constrained to the same extent using Cassowary.
     */
    getFixture: function() {
        this.solver = new ClSimplexSolver();
        
        var parent = lively.morphic.Morph.makeRectangle(7, 7, 300, 350);
        parent.addMorph(parent.child1 = lively.morphic.Morph.makeRectangle(10, 10, 100, 250));

        bbb.always({
            solver: this.solver,
            ctx: {
                parent: parent,
                _$_self: this.doitContext || this
            }
        }, function() {
            return parent.child1.getExtent().eqPt(parent.getExtent());;
        });
        
        return parent;
    },

    testFunctionality: function () {
        var parent = this.getFixture();

        this.assertEquals(
            parent.getExtent(),
            parent.submorphs[0].getExtent(),
            "Boxes do not have the same extent after constraint definition."
        );
    },
    
    testConstraintsOnMultipleLayers: function () {
        var parent = this.getFixture();

        this.assert(parent.__lookupGetter__("shape").isConstraintAccessor, "get shape is not a constraint accessor.");
        this.assert(parent.shape.__lookupGetter__("_Extent").isConstraintAccessor, "get _Extent is not a constraint accessor.");
        this.assert(parent.shape._Extent.__lookupGetter__("x").isConstraintAccessor, "get x is not a constraint accessor.");
        this.assert(parent.shape._Extent.__lookupGetter__("y").isConstraintAccessor, "get y is not a constraint accessor.");
        this.assert(parent.child1.__lookupGetter__("shape").isConstraintAccessor, "get shape is not a constraint accessor.");
        this.assert(parent.child1.shape.__lookupGetter__("_Extent").isConstraintAccessor, "get _Extent is not a constraint accessor.");
        this.assert(parent.child1.shape._Extent.__lookupGetter__("x").isConstraintAccessor, "get x is not a constraint accessor.");
        this.assert(parent.child1.shape._Extent.__lookupGetter__("y").isConstraintAccessor, "get y is not a constraint accessor.");
        
        var shape = ConstrainedVariable.findConstraintVariableFor(parent, "shape");
        var extent = ConstrainedVariable.findConstraintVariableFor(parent.shape, "_Extent");
        var x = ConstrainedVariable.findConstraintVariableFor(parent.shape._Extent, "x");
        var y = ConstrainedVariable.findConstraintVariableFor(parent.shape._Extent, "y");
        this.assertIdentity(shape, extent.parentConstrainedVariable, "parentConstrainedVariables are not set correctly.");
        this.assertIdentity(extent, x.parentConstrainedVariable, "parentConstrainedVariables are not set correctly.");
        this.assertIdentity(extent, y.parentConstrainedVariable, "parentConstrainedVariables are not set correctly.");
    },
    
    testRecursiveUnconstrain: function () {
        var parent = this.getFixture();

        bbb.unconstrain(parent.shape._Extent, "x");
        bbb.unconstrain(parent.shape._Extent, "y");

        this.assert(parent.__lookupGetter__("shape").isConstraintAccessor, "get shape is not a constraint accessor.");
        this.assert(parent.shape.__lookupGetter__("_Extent").isConstraintAccessor, "get _Extent is not a constraint accessor.");
        this.assert(typeof parent.shape._Extent.__lookupGetter__("x") === "undefined", "get x is still a constraint accessor.");
        this.assert(typeof parent.shape._Extent.__lookupGetter__("y") === "undefined", "get y is still a constraint accessor.");

        bbb.unconstrain(parent.child1, "shape");

        this.assert(parent.__lookupGetter__("child1").isConstraintAccessor, "get child1 is not a constraint accessor.");
        this.assert(typeof parent.child1.__lookupGetter__("shape") === "undefined", "get shape is still a constraint accessor.");
        this.assert(typeof parent.child1.shape.__lookupGetter__("_Extent") === "undefined", "get _Extent is still a constraint accessor.");
        this.assert(typeof parent.child1.shape._Extent.__lookupGetter__("x") === "undefined", "get x is still a constraint accessor.");
        this.assert(typeof parent.child1.shape._Extent.__lookupGetter__("y") === "undefined", "get y is still a constraint accessor.");

    }

});

}) // end of module
