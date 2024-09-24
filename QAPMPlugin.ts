import { OhosHapContext, OhosPluginId } from '@ohos/hvigor-ohos-plugin';

export function QAPMPlugin(): HvigorPlugin {
    return {
        pluginId: 'QAPMPlugin',
        apply(entryNode: HvigorNode) {
            entryNode.afterNodeEvaluate(rootNode => {
                // 获取上下文
                const hapContext = rootNode.getContext(OhosPluginId.OHOS_HAP_PLUGIN) as OhosHapContext
                // 从上下文中获取build_profiler.json5的内容
                const buildProfileOpt = hapContext.getBuildProfileOpt()
                // 获取buildOptionSet节点
                const buildOptionSet = buildProfileOpt['buildOptionSet']
                // 生成一个uuid
                const uuid = generateUUID()
                console.log(`qapmplugin generate uuid: ${uuid}`)
                for (const item of buildOptionSet) {
                    // 获取arkOptions节点
                    const arkOptions = item['arkOptions']
                    if (arkOptions) {
                        // 获取buildProfileFields节点
                        const buildFields = arkOptions['buildProfileFields']
                        if (buildFields) {
                            // 如果buildFields存在，直接加入QAPM_UUID
                            buildFields['QAPM_UUID'] = uuid
                        } else {
                            // 如不存在，则增加buildFields结构体
                            arkOptions['buildProfileFields'] = {
                                "QAPM_UUID": uuid
                            }
                        }
                    } else {
                        // 如果没有arkOptions，则直接从arkOptions开始加入
                        item['arkOptions'] = {
                            "buildProfileFields": {
                                "QAPM_UUID": uuid
                            }
                        }
                    }
                }
                // 重置配置
                hapContext.setBuildProfileOpt(buildProfileOpt)
            })

            function generateUUID(): string {
                const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
                let builder = "";
                for (let c of uuid) {
                    let i = Math.floor(Math.random() * 16);
                    switch (c) {
                        case 'y':
                            let bit = (i & 0x3) | 0x8;
                            builder += bit.toString(16);
                            break;
                        case 'x':
                            builder += i.toString(16);
                            break;
                        default:
                            builder += c;
                    }
                }
                return builder;
            }
        }
    }
}
