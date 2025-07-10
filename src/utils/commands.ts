import { Command, CommandResult, FileSystemNode } from '../types/terminal';

const findNode = (path: string[], fileSystem: FileSystemNode): FileSystemNode | null => {
  let current = fileSystem;
  for (const segment of path) {
    if (!current.children || !current.children[segment]) {
      return null;
    }
    current = current.children[segment];
  }
  return current;
};

const resolvePath = (currentPath: string[], targetPath: string): string[] => {
  if (targetPath.startsWith('/')) {
    return targetPath.slice(1).split('/').filter(Boolean);
  }
  
  const result = [...currentPath];
  const segments = targetPath.split('/').filter(Boolean);
  
  for (const segment of segments) {
    if (segment === '..') {
      result.pop();
    } else if (segment !== '.') {
      result.push(segment);
    }
  }
  
  return result;
};

export const commands: { [key: string]: Command } = {
  help: {
    name: 'help',
    description: 'Show available commands',
    usage: 'help [command]',
    execute: (args) => {
      if (args.length > 0) {
        const cmd = commands[args[0]];
        if (cmd) {
          return {
            output: `${cmd.name} - ${cmd.description}\nUsage: ${cmd.usage}`
          };
        }
        return {
          output: `No help available for '${args[0]}'`
        };
      }
      
      const helpText = [
        'Available commands:',
        '',
        'Navigation:',
        '  ls [path]     - List directory contents',
        '  cd [path]     - Change directory',
        '  pwd           - Print working directory',
        '',
        'File operations:',
        '  cat <file>    - Display file contents',
        '  open <file>   - Open file (same as cat)',
        '  find <name>   - Search for files and directories',
        '',
        'Special:',
        '  matrix        - Enter the Matrix',
        '  fire          - Ignite the flames',
        '  donut         - Spin a 3D donut',
        '',
        'System:',
        '  whoami        - Display current user',
        '  clear         - Clear terminal',
        '  history       - Show command history',
        '  help [cmd]    - Show help for command',
        '',
        'Navigation tips:',
        '  Use Tab for command completion',
        '  Use ↑/↓ arrows for command history',
        '  Use Ctrl+L to clear screen'
      ];
      
      return { output: helpText.join('\n') };
    }
  },

  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [path]',
    execute: (args, currentPath, fileSystem) => {
      const targetPath = args.length > 0 ? resolvePath(currentPath, args[0]) : currentPath;
      const node = findNode(targetPath, fileSystem);
      
      if (!node) {
        return {
          output: `ls: cannot access '${args[0] || '.'}': No such file or directory`,
          error: true
        };
      }
      
      if (node.type === 'file') {
        return {
          output: node.name
        };
      }
      
      if (!node.children) {
        return { output: '' };
      }
      
      const items = Object.values(node.children).map(child => {
        const prefix = child.type === 'directory' ? 'd' : '-';
        const perms = child.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
        const size = child.size || (child.type === 'directory' ? '8.0K' : '4.0K');
        const modified = child.modified || '2025-05-22';
        const name = child.type === 'directory' ? `\x1b[34m${child.name}\x1b[0m` : child.name;
        
        return `${prefix}${perms} 2 developer developer ${size.padStart(8)} ${modified} ${name}`;
      });
      
      return {
        output: items.length > 0 ? items.join('\n') : 'Directory is empty'
      };
    }
  },

  cd: {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd [path]',
    execute: (args, currentPath, fileSystem) => {
      if (args.length === 0) {
        return {
          output: '',
          newPath: []
        };
      }
      
      const targetPath = resolvePath(currentPath, args[0]);
      const node = findNode(targetPath, fileSystem);
      
      if (!node) {
        return {
          output: `cd: ${args[0]}: No such file or directory`,
          error: true
        };
      }
      
      if (node.type !== 'directory') {
        return {
          output: `cd: ${args[0]}: Not a directory`,
          error: true
        };
      }
      
      return {
        output: '',
        newPath: targetPath
      };
    }
  },

  pwd: {
    name: 'pwd',
    description: 'Print working directory',
    usage: 'pwd',
    execute: (args, currentPath) => {
      return {
        output: currentPath.length === 0 ? '/' : `/${currentPath.join('/')}`
      };
    }
  },

  cat: {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    execute: (args, currentPath, fileSystem) => {
      if (args.length === 0) {
        return {
          output: 'cat: missing file operand',
          error: true
        };
      }
      
      const targetPath = resolvePath(currentPath, args[0]);
      const node = findNode(targetPath, fileSystem);
      
      if (!node) {
        return {
          output: `cat: ${args[0]}: No such file or directory`,
          error: true
        };
      }
      
      if (node.type !== 'file') {
        return {
          output: `cat: ${args[0]}: Is a directory`,
          error: true
        };
      }
      
      return {
        output: node.content || ''
      };
    }
  },

  open: {
    name: 'open',
    description: 'Open file (alias for cat)',
    usage: 'open <file>',
    execute: (args, currentPath, fileSystem) => {
      return commands.cat.execute(args, currentPath, fileSystem);
    }
  },

  whoami: {
    name: 'whoami',
    description: 'Display current user',
    usage: 'whoami',
    execute: () => {
      return {
        output: 'developer'
      };
    }
  },

  clear: {
    name: 'clear',
    description: 'Clear terminal',
    usage: 'clear',
    execute: () => {
      return {
        output: '',
        clear: true
      };
    }
  },

  history: {
    name: 'history',
    description: 'Show command history',
    usage: 'history',
    execute: () => {
      // This would need to be implemented with access to terminal state
      return {
        output: 'Command history (use ↑/↓ arrows to navigate)'
      };
    }
  },

  find: {
    name: 'find',
    description: 'Search for files and directories',
    usage: 'find <name>',
    execute: (args, currentPath, fileSystem) => {
      if (args.length === 0) {
        return {
          output: 'find: missing search term',
          error: true
        };
      }
      
      const searchTerm = args[0].toLowerCase();
      const results: string[] = [];
      
      const search = (node: FileSystemNode, path: string) => {
        if (node.name.toLowerCase().includes(searchTerm)) {
          results.push(path);
        }
        
        if (node.children) {
          Object.values(node.children).forEach(child => {
            search(child, path === '/' ? `/${child.name}` : `${path}/${child.name}`);
          });
        }
      };
      
      search(fileSystem, '/');
      
      return {
        output: results.length > 0 ? results.join('\n') : `No results found for '${args[0]}'`
      };
    }
  },

  coffee: {
    name: 'coffee',
    description: 'Brew some virtual coffee',
    usage: 'coffee',
    execute: () => {
      return {
        output: `
      (  )   (   )  )
       ) (   )  (  (
       ( )  (    ) )
       _____________
      <_____________> ___
      |             |/ _ \\
      |               | | |
      |               |_| |
   ___|             |\\___/
  /    \\___________/    \\
  \\_____________________/
`
      };
    }
  },

  cowsay: {
    name: 'cowsay',
    description: 'Make a cow say something',
    usage: 'cowsay [message]',
    execute: (args) => {
      const message = args.length > 0 ? args.join(' ') : 'hello';
      const messageLength = message.length;
      const border = '_'.repeat(messageLength + 2);
      
      return {
        output: `
 ${border}
< ${message} >
 ${'-'.repeat(messageLength + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
      `
      };
    }
  },

  trex: {
    name: 'trex',
    description: 'Show a mighty T-Rex',
    usage: 'trex [message]',
    execute: (args) => {
      const message = args.length > 0 ? args.join(' ') : 'ROAR!';
      const messageLength = message.length;
      const border = '_'.repeat(messageLength + 2);
      
      return {
        output: `
 ${border}
< ${message} >
 ${'-'.repeat(messageLength + 2)}
        \\ 
         \\ 
          \\
           \\           .-=-==--==--.
            \\    ..-=="  ,'o\`)      \`.
                ,'         \`"'         \\
               :  (                     \`.__...._
               |                  )    /         \`-=-.
               :       ,vv.-._   /    /               \`---==-._
                \\/\\/\\/VV ^ d88\`;'    /                         \`.
                    \`\`  ^/d88P!'    /             ,              \`._
                       ^/    !'   ,.      ,      /                  "-,,__,,--'""""-.
                      ^/    !'  ,'  \\ . .(      (         _           )  ) ) ) ))_,-.\\
                     ^(__ ,!',"'   ;:+.:%:a.     \\:.. . ,'          )  )  ) ) ,"'    '
                     ',,,'','     /o:::":%:%a.    \\:.:.:         .    )  ) _,'
                      """'       ;':::'' \`+%%%a._  \\%:%|         ;.). _,-""
                             ,-='_.-'      \`\`:%::)  )%:|        /:._,"
                            (/(/"           ," ,'_,'%%%:       (_,'
                                           (  (//(\`.___;        \\
                                            \\     \\    \`         \`
                                             \`.    \`.   \`.        :
                                               \\. . .\\    : . . . :
                                                \\. . .:    \`.. . .:
                                                 \`..:.:\\     \\:...\\
                                                  ;:.:.;      ::...:
                                                  ):%::       :::::;
                                              __,::%:(        :::::
                                           ,;:%%%%%%%:        ;:%::
                                             ;,--""-.\\\  ,=--':%:%:\\
                                            /"       "| /-".:%%%%%%%\\
                                                            ;,-"'\`)%%)
                                                           /"      "|
      `
      };
    }
  }
};
