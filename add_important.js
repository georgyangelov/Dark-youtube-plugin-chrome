var postcss = require('postcss');

module.exports = postcss.plugin('postcss-add-important', function(options) {
    return function(css) {
        css.walkRules(function(rule) {
            rule.walkDecls(function(declaration, i) {
                if (declaration.important) {
                    throw declaration.error(
                        'Do not use `!important`. These are added automatically.',
                        {plugin: 'postcss-add-important'}
                    );
                }

                if (declaration.prop.indexOf('unimportant-') >= 0) {
                    declaration.prop = declaration.prop.replace(/^unimportant-/g, '');
                } else {
                    declaration.important = true;
                }
            });
        });
    };
});
