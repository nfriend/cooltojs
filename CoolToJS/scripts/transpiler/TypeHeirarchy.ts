module CoolToJS {

    export var UnknownType: string = '$UnknownType$';

    export class TypeHeirarchy {
        constructor(classNode: ClassNode) {
            this.classNode = classNode;
        }

        get typeName(): string {
            return this.classNode.className;
        }

        classNode: ClassNode;
        parent: TypeHeirarchy;
        children: Array<TypeHeirarchy> = [];

        public static createHeirarchy(programNode: ProgramNode): TypeHeirarchy {

            // create TypeHierarchy objects for every class defined in this program
            var allTypes = programNode.classList.map((c) => {
                return {
                    parentName: c.superClassName || 'Object',
                    typeHeirarchy: new TypeHeirarchy(c)
                };
            });

            var root: TypeHeirarchy;

            // assemble a tree out of the list of TypeHierarchy's from above
            allTypes.forEach((typeAndParent, i) => {
                if (typeAndParent.typeHeirarchy.typeName === 'Object') {
                    root = typeAndParent.typeHeirarchy;
                }

                for (var j = 0; j < allTypes.length; j++) {
                    if (j === i) continue;

                    if (typeAndParent.parentName === allTypes[j].typeHeirarchy.typeName) {
                        typeAndParent.typeHeirarchy.parent = allTypes[j].typeHeirarchy;
                        allTypes[j].typeHeirarchy.children.push(typeAndParent.typeHeirarchy);
                    }
                }
            });

            return root;
        }

        // determines whether one class either inherits or is another
        // examples:
        // isAssignableFrom('BaseClass', 'SubClass') => true
        // isAssignableFrom('SubClass', 'BaseClass') => false
        // isAssignableFrom('SubClass', 'SubClass') => true
        public isAssignableFrom(type1Name: string, type2Name: string, selfTypeClass: string): boolean {
            if (type1Name === 'SELF_TYPE') {
                type1Name = selfTypeClass;
            }

            if (type2Name === 'SELF_TYPE') {
                type2Name = selfTypeClass;
            }

            // shortcut for performance
            if (type1Name === type2Name) {
                return true;
            }

            if (type1Name === UnknownType || type2Name === UnknownType) {
                return true;
            }

            var typeHeirarchy2 = this.findTypeHeirarchy(type2Name);

            if (typeHeirarchy2) {
                while (typeHeirarchy2 != null) {
                    if (typeHeirarchy2.typeName === type1Name) {
                        return true;
                    }
                    typeHeirarchy2 = typeHeirarchy2.parent;
                }
                return false;
            }

            throw 'Type "' + type2Name + '" does not exist!';
        }

        public closetCommonParent(type1Name: string, type2Name: string): string {
            if (type1Name === type2Name) {
                return type1Name;
            }

            var type1Heirarchy = this.findTypeHeirarchy(type1Name);
            var type2Heirarchy = this.findTypeHeirarchy(type2Name);
            var originalType1Heirarchy = type1Heirarchy;

            while (type2Heirarchy) {
                type1Heirarchy = originalType1Heirarchy;
                while (type1Heirarchy) {
                    if (type1Heirarchy === type2Heirarchy) {
                        return type1Heirarchy.typeName;
                    }
                    type1Heirarchy = type1Heirarchy.parent;
                }
                type2Heirarchy = type2Heirarchy.parent;
            }

            // we should always at least find Object.  This is an error condition.
            return UnknownType;
        }

        // returns whether or not a Type exists in the current program
        public typeExists = (typeName: string): boolean => {
            return this.findTypeHeirarchy(typeName) !== null;
        }

        // finds a type in the current TypeHeirarchy Tree
        public findTypeHeirarchy = (typeName: string): TypeHeirarchy => {
            var findTypeHeirarchy = (typeHeirachy: TypeHeirarchy) => {
                if (typeHeirachy.typeName === typeName) {
                    return typeHeirachy;
                } else {
                    for (var i = 0; i < typeHeirachy.children.length; i++) {
                        var findTypeResult = findTypeHeirarchy(typeHeirachy.children[i])
                        if (findTypeResult) {
                            return findTypeResult;
                        }
                    }
                }

                return null;
            }

            return findTypeHeirarchy(this);
        }

        // returns a MethodNode that corresponds to the provided method name, given the current heirarchy.
        // providing includeInheritedMethods = false causes this method to only return MethodNodes
        // that exist directly on the given type (does not search through the inheritance tree).
        public findMethodOnType(methodName: string, typeName: string, includeInheritedMethods: boolean = true): MethodNode {
            var typeHeirarchy: TypeHeirarchy = this.findTypeHeirarchy(typeName);

            while (typeHeirarchy) {
                for (var i = 0; i < typeHeirarchy.classNode.methodList.length; i++) {
                    if (typeHeirarchy.classNode.methodList[i].methodName === methodName) {
                        return typeHeirarchy.classNode.methodList[i];
                    }
                }

                typeHeirarchy = includeInheritedMethods ? typeHeirarchy.parent : null;
            }

            return null;
        }

        // same as findMethodOnType, but for properties
        public findPropertyOnType(propertyName: string, typeName: string, includeInheritedProperties: boolean = true): PropertyNode {
            var typeHeirarchy: TypeHeirarchy = this.findTypeHeirarchy(typeName);

            while (typeHeirarchy) {
                for (var i = 0; i < typeHeirarchy.classNode.propertyList.length; i++) {
                    if (typeHeirarchy.classNode.propertyList[i].propertyName === propertyName) {
                        return typeHeirarchy.classNode.propertyList[i];
                    }
                }
                
                typeHeirarchy = includeInheritedProperties ? typeHeirarchy.parent : null;
            }

            return null;
        }
    }
} 