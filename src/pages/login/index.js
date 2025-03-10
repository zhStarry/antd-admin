import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'umi'
import { Button, Row, Input, Form } from 'antd'
import { GlobalFooter } from 'components'
import { GithubOutlined } from '@ant-design/icons'
import { t, Trans } from "@lingui/macro"
import { setLocale } from 'utils'
import config from 'utils/config'
import { encrypt } from '../../utils/rsaUtils'

import styles from './index.less'

const FormItem = Form.Item

@connect(({ loading, dispatch }) => ({ loading, dispatch }))
class Login extends PureComponent {

  render() {
    const { dispatch, loading } = this.props
    console.log(loading, 20)
    const handleOk = values => {
      
      dispatch({ type: 'login/login', payload: {
        phone: values.phone,
        password: encrypt(values.password)
      } })
    }
    let footerLinks = [
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/zuiidea/antd-admin',
        blankTarget: true,
      },
    ]

    if (config.i18n) {
      footerLinks = footerLinks.concat(
        config.i18n.languages.map(item => ({
          key: item.key,
          title: (
            <span onClick={setLocale.bind(null, item.key)}>{item.title}</span>
          ),
        }))
      )
    }

    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            <span>{config.siteName}</span>
          </div>
          <Form
            onFinish={handleOk}
            >
            <FormItem name="phone" 
              rules={[{ required: true }]} hasFeedback>
                <Input
                  placeholder="手机号"
                />
            </FormItem>
            <Trans id="Password" render={({translation}) => (
              <FormItem name="password" rules={[{ required: true }]} hasFeedback>
              <Input type='password' placeholder={translation} required />
              </FormItem>)} 
            />
            <Row>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading.effects.login}
              >
                <Trans>Sign in</Trans>
              </Button>
              <p>
                <span className="margin-right">
                  <Trans>Username</Trans>
                  ：guest
                </span>
                <span>
                  <Trans>Password</Trans>
                  ：guest
                </span>
              </p>
            </Row>
          </Form>
        </div>
        <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
