import React, { useState, useEffect } from 'react';
import { Factory, GitBranch, Layers, Zap, PlusCircle, Trash2 } from 'lucide-react';

interface Props {
  setConsole: (msg: string) => void;
}

interface ClassDef {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  parent: string | null;
  color: string;
  borderColor: string;
}

interface ObjectInstance {
  id: string;
  className: string;
  name: string;
  attributeValues: Record<string, string>;
}

export const OOPLab: React.FC<Props> = ({ setConsole }) => {
  const [mode, setMode] = useState<'FACTORY' | 'INHERITANCE' | 'POLYMORPHISM'>('FACTORY');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [instances, setInstances] = useState<ObjectInstance[]>([]);
  const [instanceCounter, setInstanceCounter] = useState(0);

  const classes: ClassDef[] = [
    {
      id: 'animal',
      name: 'Animal',
      attributes: ['name', 'age'],
      methods: ['eat()', 'sleep()'],
      parent: null,
      color: 'bg-blue-600',
      borderColor: 'border-blue-600',
    },
    {
      id: 'dog',
      name: 'Dog',
      attributes: ['breed'],
      methods: ['bark()'],
      parent: 'animal',
      color: 'bg-green-600',
      borderColor: 'border-green-600',
    },
    {
      id: 'cat',
      name: 'Cat',
      attributes: ['color'],
      methods: ['meow()'],
      parent: 'animal',
      color: 'bg-purple-600',
      borderColor: 'border-purple-600',
    },
  ];

  useEffect(() => {
    if (mode === 'FACTORY') {
      setConsole(
        'Level 10: 面向对象实验室 🏭 | 工厂模式：类 = 模具，对象 = 产品。点击类来实例化对象！'
      );
    } else if (mode === 'INHERITANCE') {
      setConsole('Level 10: 继承模式 🧬 | 基因图谱：子类继承父类的属性和方法，形成家族树。');
    } else {
      setConsole(
        'Level 10: 多态模式 🎭 | 同一接口，不同实现：Dog 和 Cat 都有 make_sound()，但行为不同。'
      );
    }
  }, [mode, setConsole]);

  const getClassById = (id: string) => classes.find(c => c.id === id);

  const createInstance = (classId: string) => {
    const classDef = getClassById(classId);
    if (!classDef) return;

    const instanceCount = instances.filter(i => i.className === classId).length + 1;
    const instanceName = `${classDef.name.toLowerCase()}_${instanceCount}`;

    const attributeValues: Record<string, string> = {};
    classDef.attributes.forEach(attr => {
      attributeValues[attr] = '?';
    });

    // Inherit parent attributes
    if (classDef.parent) {
      const parent = getClassById(classDef.parent);
      parent?.attributes.forEach(attr => {
        attributeValues[attr] = '?';
      });
    }

    const newInstance: ObjectInstance = {
      id: `${classId}_${instanceCounter}`,
      className: classId,
      name: instanceName,
      attributeValues,
    };

    setInstanceCounter(instanceCounter + 1);

    setInstances([...instances, newInstance]);
    setConsole(`✅ 实例化成功！创建了 ${classDef.name} 对象: ${instanceName}`);
  };

  const deleteInstance = (id: string) => {
    const instance = instances.find(i => i.id === id);
    setInstances(instances.filter(i => i.id !== id));
    setConsole(`🗑️ 删除对象: ${instance?.name}`);
  };

  const updateAttribute = (instanceId: string, attr: string, value: string) => {
    setInstances(
      instances.map(i =>
        i.id === instanceId ? { ...i, attributeValues: { ...i.attributeValues, [attr]: value } } : i
      )
    );
    setConsole(`📝 更新属性: ${attr} = "${value}"`);
  };

  const callMethod = (instanceId: string, method: string) => {
    const instance = instances.find(i => i.id === instanceId);
    const classDef = getClassById(instance?.className || '');

    if (!classDef) return;

    if (method === 'bark()') {
      setConsole(`🐕 ${instance?.name}.bark() -> &quot;Woof! Woof!&quot;`);
    } else if (method === 'meow()') {
      setConsole(`🐱 ${instance?.name}.meow() -> &quot;Meow~&quot;`);
    } else if (method === 'eat()') {
      setConsole(`🍖 ${instance?.name}.eat() -> &quot;Eating...&quot;`);
    } else if (method === 'sleep()') {
      setConsole(`💤 ${instance?.name}.sleep() -> &quot;Sleeping...&quot;`);
    }
  };

  const renderInheritanceTree = () => {
    const rootClasses = classes.filter(c => c.parent === null);

    const renderClassNode = (classDef: ClassDef, depth: number = 0) => {
      const children = classes.filter(c => c.parent === classDef.id);

      return (
        <div key={classDef.id} className="relative">
          <div className={`ml-${depth * 8}`}>
            <div
              className={`${classDef.color} p-4 rounded-lg border-2 border-white/20 shadow-lg mb-4 inline-block`}
            >
              <h4 className="font-bold text-white text-lg mb-2">{classDef.name}</h4>
              <div className="text-xs text-white/80 space-y-1">
                <div>
                  <strong>Attributes:</strong> {classDef.attributes.join(', ')}
                </div>
                <div>
                  <strong>Methods:</strong> {classDef.methods.join(', ')}
                </div>
              </div>
            </div>

            {children.length > 0 && (
              <div className="ml-8 border-l-2 border-white/30 pl-4">
                {children.map(child => renderClassNode(child, depth + 1))}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <GitBranch /> 继承树 (Inheritance Tree)
        </h3>
        {rootClasses.map(c => renderClassNode(c))}
      </div>
    );
  };

  const renderPolymorphismDemo = () => {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap /> 多态演示 (Polymorphism)
          </h3>
          <div className="font-mono text-sm text-slate-300 space-y-2">
            <div className="text-pve-purple">class Animal:</div>
            <div className="ml-4">
              def make_sound(self): <span className="text-slate-500"># 抽象接口</span>
            </div>
            <div className="ml-8 text-pve-red">raise NotImplementedError()</div>

            <div className="mt-4 text-pve-green">class Dog(Animal):</div>
            <div className="ml-4">
              def make_sound(self): <span className="text-slate-500"># 具体实现</span>
            </div>
            <div className="ml-8 text-pve-blue">return &quot;Woof!&quot;</div>

            <div className="mt-4 text-pve-amber">class Cat(Animal):</div>
            <div className="ml-4">
              def make_sound(self): <span className="text-slate-500"># 具体实现</span>
            </div>
            <div className="ml-8 text-pve-blue">return &quot;Meow!&quot;</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setConsole('🐕 dog.make_sound() -> &quot;Woof!&quot; (Dog 的实现)')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold transition-all"
          >
            🐕 Dog.make_sound()
          </button>
          <button
            onClick={() => setConsole('🐱 cat.make_sound() -> &quot;Meow!&quot; (Cat 的实现)')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-bold transition-all"
          >
            🐱 Cat.make_sound()
          </button>
        </div>

        <div className="bg-pve-blue/10 border border-pve-blue rounded-lg p-4">
          <p className="text-sm text-slate-300">
            💡 <strong>多态核心</strong>: 同一个接口{' '}
            <code className="text-pve-amber">make_sound()</code>
            ，不同的类有不同的实现。调用时根据对象的实际类型动态决定执行哪个方法。
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-purple">
          <Factory /> Level 10: 面向对象实验室 (OOP Lab)
        </h2>
        <div className="bg-slate-900 p-1 rounded-lg flex">
          <button
            onClick={() => setMode('FACTORY')}
            className={`px-4 py-2 rounded text-sm ${mode === 'FACTORY' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
          >
            🏭 工厂模式
          </button>
          <button
            onClick={() => setMode('INHERITANCE')}
            className={`px-4 py-2 rounded text-sm ${mode === 'INHERITANCE' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
          >
            🧬 继承模式
          </button>
          <button
            onClick={() => setMode('POLYMORPHISM')}
            className={`px-4 py-2 rounded text-sm ${mode === 'POLYMORPHISM' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
          >
            🎭 多态模式
          </button>
        </div>
      </div>

      {/* Factory Mode */}
      {mode === 'FACTORY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Templates (Molds) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers /> 类定义 (Class Templates)
            </h3>
            {classes.map(classDef => (
              <div
                key={classDef.id}
                onClick={() => setSelectedClass(classDef.id)}
                className={`${classDef.color} p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedClass === classDef.id ? 'border-white scale-105 shadow-xl' : 'border-white/20 hover:border-white/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-lg">{classDef.name}</h4>
                  {classDef.parent && (
                    <span className="text-xs bg-black/30 px-2 py-1 rounded text-white">
                      extends {getClassById(classDef.parent)?.name}
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/80 space-y-1">
                  <div>
                    <strong>Attributes:</strong> {classDef.attributes.join(', ')}
                  </div>
                  <div>
                    <strong>Methods:</strong> {classDef.methods.join(', ')}
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    createInstance(classDef.id);
                  }}
                  className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded font-bold transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={16} /> 实例化 (Instantiate)
                </button>
              </div>
            ))}
          </div>

          {/* Object Instances (Products) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Factory /> 对象实例 (Object Instances) - {instances.length}
            </h3>
            {instances.length === 0 ? (
              <div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                <p className="text-slate-500">点击左侧类定义来创建对象实例</p>
              </div>
            ) : (
              instances.map(instance => {
                const classDef = getClassById(instance.className);
                if (!classDef) return null;

                return (
                  <div
                    key={instance.id}
                    className={`${classDef.color}/20 border-2 ${classDef.borderColor} p-4 rounded-lg`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white">{instance.name}</h4>
                        <p className="text-xs text-slate-400">Instance of {classDef.name}</p>
                      </div>
                      <button
                        onClick={() => deleteInstance(instance.id)}
                        className="text-pve-red hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      {Object.keys(instance.attributeValues).map(attr => (
                        <div key={attr} className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 w-16">{attr}:</span>
                          <input
                            type="text"
                            value={instance.attributeValues[attr]}
                            onChange={e => updateAttribute(instance.id, attr, e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="value"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {classDef.methods.map(method => (
                        <button
                          key={method}
                          onClick={() => callMethod(instance.id, method)}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded transition-all"
                        >
                          {method}
                        </button>
                      ))}
                      {classDef.parent &&
                        getClassById(classDef.parent)?.methods.map(method => (
                          <button
                            key={method}
                            onClick={() => callMethod(instance.id, method)}
                            className="bg-slate-600 hover:bg-slate-500 text-white text-xs px-3 py-1 rounded transition-all border border-white/20"
                            title="Inherited method"
                          >
                            {method}
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Inheritance Mode */}
      {mode === 'INHERITANCE' && (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          {renderInheritanceTree()}
        </div>
      )}

      {/* Polymorphism Mode */}
      {mode === 'POLYMORPHISM' && renderPolymorphismDemo()}
    </div>
  );
};
