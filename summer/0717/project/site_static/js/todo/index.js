import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import {Table, Button, Space, Tag, Input, Row, Col, Popconfirm, message, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Navbar from "../components/core/navbar";
import reqwest from 'reqwest';

const { Title } = Typography;

const confirm = () => {
  message
    .loading("Deleting...", 1.8)
    .then(() => message.success("Todo item deleted!", 1.3));
};

function compare(a, b) {
  var n = -1,m = 0;
  if (a === "important") {n = 2;} else if (a === "normal")
        {n = 1;} else {n = 0;}
  if (b === "important") {m = 2;} else if (b === "normal")
        {m = 1;} else {m = 0;}
  return n - m;
}

function compareDate(a, b) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] >= b[i]) {
      return 1;
    }
  }
  return -1;
}

const getRandomuserParams = params => {
  return {
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  };
};

class App extends React.Component {
  state = {
    filteredInfo: null, sortedInfo: null, data: [],
    pagination: {current: 1, pageSize: 10}, loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({ filteredInfo: filters, sortedInfo: sorter });
    this.fetch({ pagination });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://127.0.0.1:8000/todo/api/todos/?format=json',
      method: 'get',
      type: 'json',
      data: getRandomuserParams(params),
    }).then(data => {
      this.setState({
        loading: false,
        data: data.results,
        pagination: {...params.pagination, total: data["count"],},
      });
      console.log(this.state.data);
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {this.searchInput = node;}}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            size="small" style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small" style={{ width: 90 }}
          >Reset</Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString() .toLowerCase() .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: visible => {
      if (visible) {setTimeout(() => this.searchInput.select());}
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape textToHighlight={text ? text.toString() : ""}
        />
      ) : (text)
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0], searchedColumn: dataIndex
    });
  };
  handleReset = clearFilters => {
    clearFilters(); this.setState({ searchText: "" });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null }); this.setState({ searchText: "" });
  };
  clearAll = () => {
    this.setState({ filteredInfo: null, sortedInfo: null });
  };
  onSelectChange = selectedRowKeys => {this.setState({ selectedRowKeys });};

  render() {
    const { pagination, loading } = this.state;
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Title", dataIndex: "title",
        key: "title", width: "40%",
        filters: [{ text: "Joe", value: "Joe" }, { text: "Jim", value: "Jim" }],
        filteredValue: filteredInfo.title || null,
        onFilter: (value, record) => record.title.includes(value),
        sorter: (a, b) => a.title.length - b.title.length,
        sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps("title"),
        // render: title => <EditModal title={title} />
      },
      {
        title: "Date", dataIndex: "date",
        key: "date", width: "25%",
        sorter: (a, b) => compareDate(a.date, b.date),
        sortOrder: sortedInfo.columnKey === "date" && sortedInfo.order,
        ellipsis: true
      },
      {
        title: "Level", dataIndex: "level",
        key: "level", width: "23%",
        filters: [
          { text: "Important", value: "important" },
          { text: "Normal", value: "normal" },
          { text: "Unimportant", value: "unimportant" }
        ],
        filteredValue: filteredInfo.level || null,
        onFilter: (value, record) => record.level.includes(value),
        sorter: (a, b) => compare(a.level, b.level),
        sortOrder: sortedInfo.columnKey === "level" && sortedInfo.order,
        ellipsis: true,
        render: level => <Tag>{level.toUpperCase()}</Tag>
      },
      {
        title: "Action", dataIndex: "",
        key: "x", width: "12%",
        render: () => (
          <Popconfirm
            placement="topRight"
            title="Are you sure to delete this task?"
            onConfirm={confirm} okText="Yes" cancelText="No"
          >
            <a>delete</a>
          </Popconfirm>
        )
      }
    ];
    return (
      <>
        <Row justify="center" align="top">
          <Col style={{ maxWidth: 1080 }}>
            <Title level={2} style={{ paddingTop: 30, paddingBottom: 15 }}>Todos</Title>
          </Col>
        </Row>
        <Row justify="center" align="top">
          <Col style={{ maxWidth: 1080 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button onClick={this.clearFilters}>Clear filters</Button>
              <Button onClick={this.clearAll}>Clear filters and sorters</Button>
            </Space>
            <Table
              columns={columns} dataSource={this.state.data}
              onChange={this.handleChange} size="middle"
              pagination={pagination} loading={loading}
              expandable={{
                expandedRowRender: record => (
                  <p style={{ margin: 0, paddingLeft: 48 }}>{record.desc}</p>
                ),
                rowExpandable: record => record.expd
              }}
            />
          </Col>
        </Row>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Navbar />, document.getElementById("navbar"));