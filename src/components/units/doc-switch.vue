/*
 * @Author: chengshanshan 
 * @Date: 2018-07-30 15:03:41 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-07-30 15:10:22
 * @instrction:开关组件
 */

<template>
    <span
        tabindex="0"
        :class="wrapClasses"
        @click="toggle"
        @keydown.space="toggle"
    >
        <input type="hidden" :name="name" :value="currentValue">
        <span :class="innerClasses">
            <slot name="open" v-if="currentValue === trueValue"></slot>
            <slot name="close" v-if="currentValue === falseValue"></slot>
        </span>
    </span>
</template>
<script>
    const prefixCls = 'doc-switch';
    export default {
      
        props: {
            value: {
                type: [String, Number, Boolean],
                default: false
            },
            trueValue: {
                type: [String, Number, Boolean],
                default: true
            },
            falseValue: {
                type: [String, Number, Boolean],
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            size: {
                type:String,
                default: 'default'
                
            },
            name: {
                type: String
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-loading`]: this.loading,
                    }
                ];
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            }
        },
        methods: {
            toggle (event) {
                event.preventDefault();
                if (this.disabled || this.loading) {
                    return false;
                }
                const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue;
                this.currentValue = checked;
                this.$emit('input', checked);
                this.$emit('on-change', checked);
 
            }
        },
        watch: {
            value (val) {
                if (val !== this.trueValue && val !== this.falseValue) {
                    throw 'Value should be trueValue or falseValue.';
                }
                this.currentValue = val;
            }
        }
    };
</script>
<style lang="scss" scoped>
.doc-switch{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #ccc;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
    &:after{
        content:"";
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        left: 1px;
        top: 1px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
    &.doc-switch-checked{
        border: 1px solid #005BFF;
        &:after{
        background-color: #005BFF;  
        }
        
    }
}
.doc-switch-small{
    width: 14px;
    height: 14px;
    &:after{
        width: 10px;
        height: 10px;
    }
}
</style>


